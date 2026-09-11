"use client"

import { useState, useRef } from "react"
import { Upload, CheckCircle2 } from "lucide-react"
import {
  importMultipleJsonToLocalDb,
  requestPersistentStorage,
  type BatchImportItem
} from "@/lib/client-db"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants"

const MAX_FILE_SIZE = MAX_UPLOAD_SIZE_BYTES

interface UploadZoneProps {
  onUploadSuccess?: () => void
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const t = useT()

  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
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
        toast.error(result.results[0]?.error || t.management.uploadFailed)
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || t.management.uploadFailed)
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
    </div>
  )
}
