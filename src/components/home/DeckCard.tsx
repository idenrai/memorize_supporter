"use client"

import Link from "next/link"
import { Layers, History, Trash2, ArrowRight, Ban } from "lucide-react"
import { useT } from "@/hooks/useT"
import { isQuizType } from "@/types/card"
import { getDeckTypeLabel, getDeckTypeBadgeClass } from "@/lib/deck-utils"

interface DeckCardProps {
  deck: string
  deckName: string
  description?: string | null
  type?: string
  count: number
  lang: string
  globalLimit: number
  globalIsExamMode: boolean
  isLocal?: boolean
  onDelete?: (deckId: string) => void
}

export default function DeckCard({
  deck,
  deckName,
  description,
  type = 'flashcard',
  count,
  lang,
  globalLimit,
  globalIsExamMode,
  isLocal,
  onDelete
}: DeckCardProps) {
  const t = useT()

  const isQuiz = isQuizType(type)
  const isExamTarget = globalIsExamMode && isQuiz
  const isExamDisabled = globalIsExamMode && !isQuiz

  const typeLabel = getDeckTypeLabel(type, t)

  const studyUrl = `/${lang}/deck/${deck}?limit=${globalLimit}${
    isExamTarget ? '&mode=exam' : ''
  }`

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 sm:p-6 h-full transition-all duration-200 ${
        isExamDisabled
          ? 'rounded-2xl border border-zinc-800/60 bg-zinc-900/40 opacity-40 grayscale-40 cursor-not-allowed select-none'
          : 'card-interactive'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-2xs font-semibold border ${getDeckTypeBadgeClass(type)}`}>
            {typeLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-2xs font-medium text-zinc-400">
            <Layers size={12} className="text-zinc-500" aria-hidden="true" />
            <span className="tabular-nums font-semibold text-zinc-300">{count}</span>
            <span>{t.home.cards}</span>
          </span>
        </div>

        {/* Secondary Actions (History, Delete) */}
        <div className="flex items-center gap-1 z-20">
          <Link
            href={`/${lang}/records?deckId=${deck}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title={t.common.examRecords}
            aria-label={t.common.examRecords}
          >
            <History size={15} aria-hidden="true" />
          </Link>

          {isLocal && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDelete(deck)
              }}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title={t.management.delete}
              aria-label={t.management.delete}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content (Clickable Area via stretched Link, or disabled div) */}
      <div className="flex-1 my-1">
        {isExamDisabled ? (
          <div className="block rounded-lg select-none" aria-disabled="true">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-400 line-clamp-2 leading-snug mb-2">
              {deckName}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 line-clamp-2 leading-relaxed font-normal">
              {description || t.home.defaultDesc(count)}
            </p>
          </div>
        ) : (
          <Link
            href={studyUrl}
            className="block rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 after:absolute after:inset-0 after:rounded-2xl"
          >
            <h3 className="text-lg sm:text-xl font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
              {deckName}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed font-normal">
              {description || t.home.defaultDesc(count)}
            </p>
          </Link>
        )}
      </div>

      {/* Bottom Action Footer (Visual indicator, clicks bubbled via card) */}
      <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs pointer-events-none">
        {isExamDisabled ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-zinc-500" aria-hidden="true">
            <Ban size={13} className="text-zinc-500" aria-hidden="true" />
            <span>{t.home.examNotSupported}</span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
              isExamTarget
                ? 'text-indigo-400 group-hover:text-indigo-200'
                : 'text-indigo-400 group-hover:text-indigo-300'
            }`}
            aria-hidden="true"
          >
            <span>{isExamTarget ? t.home.clickToStartExam : t.home.clickToStudy}</span>
            <ArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  )
}

