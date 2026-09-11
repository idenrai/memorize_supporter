"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Download, Upload, HardDrive, Database } from "lucide-react"
import { useT } from "@/hooks/useT"
import {
  exportLocalDataJson,
  importBackupJson,
  getStorageEstimate,
  requestPersistentStorage,
  onLocalDbChange,
  type StorageEstimateResult
} from "@/lib/client-db"
import { toast } from "sonner"

interface BackupRestoreCardProps {
  onRestoreSuccess?: () => void
}

export default function BackupRestoreCard({ onRestoreSuccess }: BackupRestoreCardProps) {
  const t = useT()
  const [storageInfo, setStorageInfo] = useState<StorageEstimateResult | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isCancelled = false

    async function load() {
      try {
        const info = await getStorageEstimate()
        if (!isCancelled) setStorageInfo(info)
      } catch {
        // Ignore storage estimate failure
      }
    }

    load()

    const unsubscribe = onLocalDbChange(() => {
      getStorageEstimate().then((info) => {
        if (!isCancelled) setStorageInfo(info)
      })
    })

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [])

  // Export Full Backup
  const handleExportBackup = async () => {
    setIsExporting(true)
    try {
      const json = await exportLocalDataJson()
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `memorize_supporter_backup_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(t.local.exportBackup)
    } catch (e) {
      console.error("Backup export failed", e)
      toast.error(t.common.error)
    } finally {
      setIsExporting(false)
    }
  }

  // Restore Full Backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!window.confirm(t.local.confirmRestore)) {
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    startTransition(async () => {
      try {
        const text = await file.text()
        const res = await importBackupJson(text)
        if (res.success && res.restoredCount) {
          toast.success(t.local.restoreSuccess(res.restoredCount.decks, res.restoredCount.examResults))
          await requestPersistentStorage().catch(() => {})
          getStorageEstimate().then(setStorageInfo).catch(() => {})
          onRestoreSuccess?.()
        } else {
          toast.error(res.error || t.local.restoreFailed)
        }
      } catch (err) {
        console.error("Backup restore failed", err)
        toast.error(t.local.restoreFailed)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    })
  }

  return (
    <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleRestoreFile}
        className="hidden"
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header with Title & Storage Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
              <Database size={24} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight break-keep">
                {t.management.backupSectionTitle}
              </h2>
            </div>
          </div>

          {/* Storage usage indicator */}
          {storageInfo && storageInfo.usageMB > 0 && (
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 shadow-sm"
              title={storageInfo.persisted ? t.local.persistentStorageDesc : t.local.temporaryStorageDesc}
            >
              <HardDrive size={14} className={storageInfo.persisted ? "text-emerald-400" : "text-zinc-400"} />
              <span className="tabular-nums">
                {t.management.storageStatus(`${storageInfo.usageMB} MB`, storageInfo.persisted)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl break-keep">
          {t.management.backupSectionDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting || isPending}
            className="btn-indigo px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-md shadow-indigo-900/20"
          >
            <Download size={16} />
            <span>{t.management.backupDownload}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExporting || isPending}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-50 text-zinc-200 text-sm font-semibold rounded-xl border border-zinc-700 transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-500"
          >
            <Upload size={16} />
            <span>{t.management.backupRestore}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
