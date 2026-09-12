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
        className={`group relative flex flex-col items-center justify-center text-center cursor-pointer p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all duration-300 backdrop-blur-xl ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-white/15 hover:border-indigo-400/60 bg-zinc-900/60 hover:bg-zinc-900/80 shadow-lg"
        } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-3.5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
            {isImporting ? (
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={28} aria-hidden="true" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-1.5">
            {isImporting
              ? (progress && progress.total > 1
                  ? t.management.uploadingProgress(progress.current, progress.total)
                  : t.management.uploading)
              : t.management.uploadDropzoneTitle}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-4">
            {t.management.uploadDropzoneDesc}
          </p>

          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300/90 font-medium bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
              <CheckCircle2 size={13} className="text-indigo-400" />
              {t.management.privacyBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Inline Validation Error Panel */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="mt-4 p-5 rounded-3xl bg-rose-950/40 border border-rose-500/30 text-rose-200 shadow-xl backdrop-blur-xl animate-in fade-in-50 duration-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle size={18} aria-hidden="true" />
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
              className="p-1.5 rounded-full text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
              aria-label={t.management.cancel}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 mt-2">
            {validationErrors.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/40 border border-rose-500/20 text-xs font-mono"
              >
                <div className="flex items-center gap-2 text-rose-300 font-semibold mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30">
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
              올바른 데이터 형식이 필요하신가요?
            </span>
            <Link
              href={`/${lang}/data-preparation`}
              className="inline-flex items-center gap-1 font-semibold text-rose-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              <span>데이터 준비 탭에서 템플릿 확인하기</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
