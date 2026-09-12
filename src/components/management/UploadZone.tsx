"use client"

import { useState, useRef } from "react"
import { Upload, CheckCircle2, AlertCircle, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  importMultipleJsonToLocalDb,
  requestPersistentStorage,
  type BatchImportItem
} from "@/lib/client-db"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants"
import type { Lang } from "@/i18n/types"

const MAX_FILE_SIZE = MAX_UPLOAD_SIZE_BYTES

interface UploadZoneProps {
  onUploadSuccess?: () => void
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const t = useT()
  const params = useParams()
  const lang = (params?.lang as Lang) || "ko"

  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [validationErrors, setValidationErrors] = useState<Array<{ fileName: string; error: string }> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: File[]) => {
    if (!files || files.length === 0) return

    const jsonFiles: File[] = []
    let nonJsonCount = 0
    let oversizedCount = 0

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".json")) {
        nonJsonCount++
      } else if (file.size > MAX_FILE_SIZE) {
        oversizedCount++
      } else {
        jsonFiles.push(file)
      }
    }

    if (nonJsonCount > 0) {
      toast.info(t.management.nonJsonSkipped(nonJsonCount))
    }

    if (oversizedCount > 0) {
      toast.error(t.management.uploadSizeLimitError)
    }

    if (jsonFiles.length === 0) {
      if (nonJsonCount > 0 && oversizedCount === 0) {
        toast.error(t.local.jsonOnlyError)
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setIsImporting(true)
    setProgress({ current: 0, total: jsonFiles.length })
    setValidationErrors(null)

    try {
      const readResults = await Promise.allSettled(
        jsonFiles.map(async (file) => ({
          content: await file.text(),
          fileName: file.name
        }))
      )

      const items: BatchImportItem[] = readResults
        .filter((r): r is PromiseFulfilledResult<BatchImportItem> => r.status === "fulfilled")
        .map((r) => r.value)

      if (items.length === 0) {
        toast.error(t.local.fileReadError)
        return
      }

      const result = await importMultipleJsonToLocalDb(items, (current, total) => {
        setProgress({ current, total })
      })

      const failedItems = result.results.filter((r) => !r.success && r.error)
      if (failedItems.length > 0) {
        setValidationErrors(
          failedItems.map((f) => ({
            fileName: f.fileName,
            error: f.error || t.management.uploadFailed
          }))
        )
      }

      if (result.successCount > 0) {
        requestPersistentStorage().catch(() => {})
        onUploadSuccess?.()

        if (result.failedCount === 0) {
          if (result.total === 1) {
            toast.success(t.management.uploadSuccess)
          } else {
            toast.success(t.management.multiUploadSuccess(result.successCount))
          }
        } else {
          toast.warning(t.management.multiUploadPartial(result.successCount, result.total))
        }
      } else {
        toast.error(t.management.uploadFailed)
      }
    } catch (err: unknown) {
      const errMsg = (err as Error)?.message || t.management.uploadFailed
      setValidationErrors([{ fileName: "upload", error: errMsg }])
      toast.error(errMsg)
    } finally {
      setIsImporting(false)
      setProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) processFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) processFiles(files)
  }

  return (
    <div className="w-full mb-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t.management.uploadDropzoneTitle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center text-center cursor-pointer p-6 sm:p-8 rounded-2xl border border-dashed transition-all duration-150 ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-900/60"
        } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-zinc-900 text-indigo-400 rounded-xl flex items-center justify-center mb-3 border border-zinc-800 group-hover:scale-105 group-hover:border-zinc-700 transition-all duration-150 shadow-xs">
            {isImporting ? (
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={22} aria-hidden="true" />
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-zinc-100 mb-1">
            {isImporting
              ? (progress && progress.total > 1
                  ? t.management.uploadingProgress(progress.current, progress.total)
                  : t.management.uploading)
              : t.management.uploadDropzoneTitle}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-4 font-normal">
            {t.management.uploadDropzoneDesc}
          </p>

          {/* Progress Bar during import */}
          {isImporting && progress && (
            <div
              role="progressbar"
              aria-valuenow={Math.round((progress.current / progress.total) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t.management.uploadingProgress(progress.current, progress.total)}
              className="w-full max-w-xs h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4"
            >
              <div
                className="h-full bg-indigo-500 transition-all duration-200"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-2xs text-zinc-400 font-mono bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
              <span className="text-indigo-400 font-bold">.JSON</span>
              <span>{t.management.schemaLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-2xs text-zinc-400 font-medium bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
              <CheckCircle2 size={12} className="text-emerald-400" aria-hidden="true" />
              {t.management.privacyBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Inline Validation Error Panel */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="mt-4 p-5 rounded-2xl bg-zinc-900 border border-rose-500/30 text-rose-200 shadow-xl animate-in fade-in-50 duration-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle size={16} aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-100 tracking-tight">
                  {t.management.validationErrorTitle}
                </h4>
                <p className="text-xs text-rose-300/80 leading-relaxed mt-0.5">
                  {t.management.validationErrorDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValidationErrors(null)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
              aria-label={t.management.cancel}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2 mt-2">
            {validationErrors.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-950/80 border border-rose-500/20 text-xs font-mono"
              >
                <div className="flex items-center gap-2 text-rose-300 font-semibold mb-1">
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30">
                    {item.fileName}
                  </span>
                </div>
                <p className="text-rose-200/90 whitespace-pre-wrap leading-relaxed font-sans text-xs break-all">
                  {item.error}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3.5 pt-3 border-t border-rose-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-rose-300/70">
              {t.management.needHelpTemplate}
            </span>
            <Link
              href={`/${lang}/data-preparation`}
              className="inline-flex items-center gap-1 font-semibold text-rose-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              <span>{t.management.checkTemplatesInPrep}</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
