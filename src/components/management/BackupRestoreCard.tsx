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
import { formatStorageMB } from "@/lib/storage-format"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface BackupRestoreCardProps {
  onRestoreSuccess?: () => void
}

export default function BackupRestoreCard({ onRestoreSuccess }: BackupRestoreCardProps) {
  const t = useT()
  const [storageInfo, setStorageInfo] = useState<StorageEstimateResult | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [pendingRestoreFile, setPendingRestoreFile] = useState<File | null>(null)
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
    setPendingRestoreFile(file)
  }

  const handleCancelRestore = () => {
    setPendingRestoreFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleConfirmRestore = () => {
    if (!pendingRestoreFile) return
    const file = pendingRestoreFile

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
        setPendingRestoreFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    })
  }

  return (
    <div className="card-precision p-6 sm:p-8">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleRestoreFile}
        className="hidden"
      />

      <div className="flex flex-col gap-6">
        {/* Header with Title & Storage Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-400 flex items-center justify-center shadow-xs">
              <Database size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight break-keep">
                {t.management.backupSectionTitle}
              </h2>
            </div>
          </div>

          {/* Storage usage indicator */}
          {storageInfo && storageInfo.usageMB > 0 && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 shadow-xs cursor-help hover:border-zinc-600 transition-colors"
              title={
                storageInfo.quotaMB > 0
                  ? t.management.storageTooltip(
                      formatStorageMB(storageInfo.usageMB),
                      formatStorageMB(storageInfo.quotaMB)
                    )
                  : (storageInfo.persisted ? t.local.persistentStorageDesc : t.local.temporaryStorageDesc)
              }
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
              <HardDrive size={13} className="text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="tabular-nums font-medium">
                {t.management.storageStatus(formatStorageMB(storageInfo.usageMB))}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl break-keep font-normal">
          {t.management.backupSectionDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting || isPending}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Download size={14} aria-hidden="true" />
            <span>{t.management.backupDownload}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExporting || isPending}
            className="btn-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Upload size={14} aria-hidden="true" />
            <span>{t.management.backupRestore}</span>
          </button>
        </div>
      </div>

      {/* Custom Accessible Confirm Modal */}
      <ConfirmModal
        isOpen={pendingRestoreFile !== null}
        title={t.management.backupRestore}
        description={t.local.confirmRestore}
        confirmText={t.management.backupRestore}
        cancelText={t.management.cancel}
        isDestructive={false}
        isLoading={isPending}
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
      />
    </div>
  )
}
