"use client"

import { useEffect, useState } from "react"
import {
  getLocalExamResults,
  deleteLocalExamResult,
  onLocalDbChange,
  type LocalExamResult
} from "@/lib/client-db"
import { Trophy, Calendar, ArrowRight, Trash2, Database } from "lucide-react"
import Link from "next/link"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"
import { PASS_MARK_PERCENT } from "@/lib/constants"
import ConfirmModal from "@/components/ui/ConfirmModal"

export default function LocalRecordsView({
  deckId,
  lang,
  hideEmptyState = false
}: {
  deckId?: string
  lang: Lang
  hideEmptyState?: boolean
}) {
  const t = useT()
  const [localRecords, setLocalRecords] = useState<LocalExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function load() {
      try {
        const results = await getLocalExamResults(deckId)
        if (!isCancelled) setLocalRecords(results)
      } catch (e) {
        console.warn("Failed to load local exam results", e)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }
    load()

    const unsubscribe = onLocalDbChange((event) => {
      if (event === "exam_saved" || event === "exam_deleted" || event === "backup_restored") {
        getLocalExamResults(deckId).then((results) => {
          if (!isCancelled) setLocalRecords(results)
        })
      }
    })

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [deckId])

  const handleConfirmDeleteRecord = async () => {
    if (!deletingRecordId) return
    setIsDeleting(true)
    try {
      const ok = await deleteLocalExamResult(deletingRecordId)
      if (ok) {
        setLocalRecords((prev) => prev.filter((r) => r.id !== deletingRecordId))
        toast.success(t.records.deleteSuccess)
      } else {
        toast.error(t.records.deleteFailed)
      }
    } catch {
      toast.error(t.records.deleteFailed)
    } finally {
      setIsDeleting(false)
      setDeletingRecordId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (localRecords.length === 0) {
    if (hideEmptyState) return null

    return (
      <div className="text-center p-8 sm:p-12 w-full card-precision flex flex-col items-center justify-center">
        <div className="w-14 h-14 bg-zinc-800 border border-zinc-700/80 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
          <Trophy size={26} aria-hidden="true" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-100 mb-2 tracking-tight break-keep text-balance">
          {t.records.empty}
        </h3>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed break-keep text-balance max-w-md font-normal">
          {t.records.emptyDesc}
        </p>
        <div className="flex items-center justify-center">
          <Link
            href={`/${lang}`}
            className="px-6 py-2.5 btn-primary rounded-xl text-xs sm:text-sm font-semibold"
          >
            {t.common.study}
          </Link>
        </div>
      </div>
    )
  }

  const PASS_MARK = PASS_MARK_PERCENT

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg text-zinc-300 bg-zinc-800 border border-zinc-700/60">
          {t.local.recordsHeader(localRecords.length)}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/${lang}/data-management`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            title={t.records.manageBackupLink}
          >
            <Database size={13} className="text-indigo-400" />
            <span>{t.records.manageBackupLink}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {localRecords.map((record) => {
          const isPassed = record.score >= PASS_MARK
          return (
            <div
              key={record.id}
              className="card-precision p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-zinc-500" aria-hidden="true" />
                    {new Date(record.createdAt).toLocaleString(lang, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xs font-semibold px-2.5 py-0.5 rounded-md border ${
                        isPassed
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isPassed ? t.local.passedBadge : t.local.needsReviewBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeletingRecordId(record.id)}
                      className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                      title={t.management.delete}
                      aria-label={t.management.delete}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                      isPassed ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {record.score}%
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-zinc-400 tabular-nums">
                    {t.local.scoreDetail(record.correct, record.total)}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                <span className="text-2xs text-zinc-500 truncate max-w-40 font-mono">
                  {t.local.deckIdLabel}: {record.deckId}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${lang}/records/${record.id}`}
                    className="btn-secondary px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>{t.records.reviewExam}</span>
                  </Link>
                  <Link
                    href={`/${lang}/deck/${record.deckId}?mode=exam`}
                    className="btn-primary px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>{t.local.retake}</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Custom Confirm Modal for Exam Record Deletion */}
      <ConfirmModal
        isOpen={deletingRecordId !== null}
        title={t.records.confirmDeleteRecordTitle}
        description={t.records.confirmDeleteRecordDesc}
        confirmText={t.management.delete}
        cancelText={t.management.cancel}
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteRecord}
        onCancel={() => setDeletingRecordId(null)}
      />
    </div>
  )
}
