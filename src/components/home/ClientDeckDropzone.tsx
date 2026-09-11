"use client"

import { useState, useRef } from "react"
import { Upload, Plus, CheckCircle2 } from "lucide-react"
import { importJsonToLocalDb, requestPersistentStorage } from "@/lib/client-db"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"

interface ClientDeckDropzoneProps {
  onImportSuccess?: () => void
}

export default function ClientDeckDropzone({ onImportSuccess }: ClientDeckDropzoneProps) {
  const t = useT()
  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error(t.local.jsonOnlyError)
      return
    }

    setIsImporting(true)
    try {
      const text = await file.text()
      const result = await importJsonToLocalDb(text, file.name)
      if (result.success) {
        toast.success(t.local.importSuccess || t.management.uploadSuccess)
        requestPersistentStorage().catch(() => {})
        onImportSuccess?.()
        setIsOpen(false)
      } else {
        toast.error(result.error || t.local.importFailed)
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || t.local.fileReadError)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
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
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="w-full mb-6">
      {!isOpen ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-indigo-500/60 rounded-full transition-all duration-300 shadow-sm hover:shadow-glow-indigo"
          >
            <Plus size={16} aria-hidden="true" />
            <span>{t.local.importButton}</span>
          </button>
        </div>
      ) : (
        <div className="relative p-6 sm:p-8 bg-zinc-900/70 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400/80 rounded-3xl transition-all duration-300 backdrop-blur-md overflow-hidden">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-full bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors"
            >
              {t.local.close}
            </button>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-label={t.local.dropPrompt}
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
            className={`flex flex-col items-center justify-center text-center cursor-pointer p-4 rounded-2xl transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
              isDragging ? "scale-[1.01] opacity-90" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner">
              {isImporting ? (
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} aria-hidden="true" />
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-zinc-100 mb-1">
              {isImporting ? t.local.savingPrompt : t.local.dropPrompt}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-3">
              {t.local.privacyNotice}
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              <CheckCircle2 size={13} />
              {t.local.securityTag}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
