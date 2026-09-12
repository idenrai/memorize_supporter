"use client"

import Link from "next/link"
import { History, Trash2 } from "lucide-react"
import type { Lang, Translations } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import type { Deck } from "@/types/deck"

function DeckListRow({
  deck,
  lang,
  t,
  globalLimit,
  globalIsExamMode,
  onDelete
}: {
  deck: Deck
  lang: Lang
  t: Translations
  globalLimit: number
  globalIsExamMode: boolean
  onDelete?: (deckId: string) => void
}) {
  const typeLabel =
    deck.type === 'practice_quiz'
      ? t.quiz.practiceQuiz
      : deck.type === 'vocabulary'
      ? t.quiz.vocabulary
      : t.quiz.flashcard

  const studyUrl = `/${lang}/deck/${deck.id}?limit=${globalLimit}${
    globalIsExamMode && deck.type === 'practice_quiz' ? '&mode=exam' : ''
  }`

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 card-interactive gap-4">
      <Link
        href={studyUrl}
        className="flex items-center gap-4 flex-1 overflow-hidden min-w-0 group rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 text-indigo-400 font-bold shrink-0 border border-zinc-700/60">
          {deck.type.charAt(0).toUpperCase()}
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
          className="px-4 py-1.5 rounded-lg text-xs font-semibold btn-primary select-none"
        >
          {t.common.study}
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
  const t = useT()
  
  return (
    <div className="flex flex-col gap-3">
      {decks.map((deck) => (
        <DeckListRow
          key={deck.id}
          deck={deck}
          lang={lang} 
          t={t} 
          globalLimit={globalLimit}
          globalIsExamMode={globalIsExamMode}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
