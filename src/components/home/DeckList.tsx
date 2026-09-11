"use client"

import Link from "next/link"
import { History, Trash2 } from "lucide-react"
import type { Lang, Translations } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import type { Deck } from "./DeckGallery"

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
  const typeLabel = deck.type === 'practice_quiz' ? t.quiz.practiceQuiz : deck.type === 'vocabulary' ? t.quiz.vocabulary : t.quiz.flashcard

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 rounded-2xl transition-colors group gap-4">
      <div className="flex items-center gap-4 flex-1 overflow-hidden min-w-0">
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold shrink-0">
          {deck.type.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col truncate min-w-0 flex-1">
          <span className="font-bold text-zinc-100 truncate text-lg block group-hover:text-indigo-300 transition-colors">{deck.title}</span>
          <span className="text-sm text-zinc-400 truncate flex items-center gap-2">
            <span className="shrink-0">{typeLabel}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full shrink-0" />
            <span className="shrink-0 tabular-nums">{deck._count.cards} {t.home.cards}</span>
            {deck.isLocal && (
              <>
                <span className="w-1 h-1 bg-zinc-700 rounded-full shrink-0" />
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 shrink-0">
                  {t.local.badge}
                </span>
              </>
            )}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-1 shadow-sm relative shrink-0">
          {deck.isLocal && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(deck.id)}
              className="flex items-center justify-center p-2 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors mr-1"
              title={t.management.delete}
              aria-label={t.management.delete}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          )}

          <Link
            href={`/${lang}/records?deckId=${deck.id}`}
            className="flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-1"
            title={t.common.examRecords}
            aria-label={t.common.examRecords}
          >
            <History size={16} aria-hidden="true" />
          </Link>

          <Link 
            href={`/${lang}/deck/${deck.id}?limit=${globalLimit}${globalIsExamMode && deck.type === 'practice_quiz' ? '&mode=exam' : ''}`}
            className="min-w-17.5 shrink-0 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider btn-indigo text-center"
          >
            {t.common.study}
          </Link>
        </div>
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
