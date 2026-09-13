"use client"

import Link from "next/link"
import { Layers, History, Trash2, CheckSquare, Languages } from "lucide-react"
import { useT } from "@/hooks/useT"
import { isQuizType } from "@/types/card"
import { getDeckTypeLabel } from "@/lib/deck-utils"
import type { Deck } from "@/types/deck"
import type { Lang } from "@/i18n/types"

interface DeckListItemProps {
  deck: Deck
  lang: Lang
  globalLimit: number
  globalIsExamMode: boolean
  onDelete?: (deckId: string) => void
}

function DeckListItem({
  deck,
  lang,
  globalLimit,
  globalIsExamMode,
  onDelete
}: DeckListItemProps) {
  const t = useT()

  const isQuiz = isQuizType(deck.type)
  const isExamTarget = globalIsExamMode && isQuiz

  const typeLabel = getDeckTypeLabel(deck.type, t)

  const Icon =
    isQuiz
      ? CheckSquare
      : deck.type === 'vocabulary'
      ? Languages
      : Layers

  const studyUrl = `/${lang}/deck/${deck.id}?limit=${globalLimit}${
    isExamTarget ? '&mode=exam' : ''
  }`

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 card-interactive gap-4">
      <Link
        href={studyUrl}
        className="flex items-center gap-4 flex-1 overflow-hidden min-w-0 group rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 text-indigo-400 shrink-0 border border-zinc-700/60 shadow-xs">
          <Icon size={18} aria-hidden="true" />
        </div>
        <div className="flex flex-col truncate min-w-0 flex-1">
          <span className="font-bold text-zinc-100 truncate text-base sm:text-lg block group-hover:text-indigo-400 transition-colors">
            {deck.title}
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 truncate flex items-center gap-2 mt-0.5">
            <span className="shrink-0">{typeLabel}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full shrink-0" />
            <span className="shrink-0 tabular-nums">{deck._count.cards} {t.home.cards}</span>
          </span>
        </div>
      </Link>
      
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {deck.isLocal && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(deck.id)}
            className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title={t.management.delete}
            aria-label={t.management.delete}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}

        <Link
          href={`/${lang}/records?deckId=${deck.id}`}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title={t.common.examRecords}
          aria-label={t.common.examRecords}
        >
          <History size={16} aria-hidden="true" />
        </Link>

        <Link 
          href={studyUrl}
          tabIndex={-1}
          aria-hidden="true"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold select-none transition-colors ${
            isExamTarget
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs font-bold'
              : 'btn-primary'
          }`}
        >
          {isExamTarget ? t.common.takeExam : t.common.study}
        </Link>
      </div>
    </div>
  )
}

export default function DeckList({
  decks,
  lang,
  globalLimit,
  globalIsExamMode,
  onDelete
}: {
  decks: Deck[]
  lang: Lang
  globalLimit: number
  globalIsExamMode: boolean
  onDelete?: (deckId: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {decks.map((deck) => (
        <DeckListItem
          key={deck.id}
          deck={deck}
          lang={lang} 
          globalLimit={globalLimit}
          globalIsExamMode={globalIsExamMode}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
