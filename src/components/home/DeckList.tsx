"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, History } from "lucide-react"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import type { Deck } from "./DeckGallery"

function DeckListRow({ deck, lang, t, globalLimit }: { deck: Deck, lang: Lang, t: any, globalLimit: number }) {
  const count = deck._count.cards
  const [isExamMode, setIsExamMode] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 rounded-2xl transition-colors group gap-4">
      <div className="flex items-center gap-4 flex-1 overflow-hidden min-w-0">
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold shrink-0">
          {deck.type.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col truncate min-w-0 flex-1">
          <span className="font-bold text-zinc-100 truncate text-lg block group-hover:text-indigo-300 transition-colors">{deck.title}</span>
          <span className="text-sm text-zinc-400 truncate flex items-center gap-2">
            <span className="capitalize shrink-0">{deck.type}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full shrink-0" />
            <span className="shrink-0">{deck._count.cards} {t.home.cards}</span>
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 shrink-0">

        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-1 shadow-sm relative shrink-0">
          {deck.type === 'practice_quiz' && (
            <div className="flex items-center bg-zinc-900/80 rounded-full p-0.5 mr-1 border border-zinc-800/80 shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); setIsExamMode(false) }}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                  !isExamMode 
                    ? 'bg-zinc-700 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                Practice
              </button>
              <button
                onClick={(e) => { e.preventDefault(); setIsExamMode(true) }}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 ${
                  isExamMode 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                Exam
              </button>
            </div>
          )}
          
          <Link
            href={`/${lang}/records?deckId=${deck.id}`}
            className="flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-1"
            title={t.common.examRecords}
          >
            <History size={16} aria-hidden="true" />
          </Link>

          <Link 
            href={`/${lang}/deck/${deck.id}?limit=${globalLimit}${isExamMode ? '&mode=exam' : ''}`}
            className="px-5 py-1.5 rounded-full text-xs uppercase tracking-wider btn-indigo text-center"
          >
            {t.common.study}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DeckList({ decks, lang, globalLimit }: { decks: Deck[], lang: Lang, globalLimit: number }) {
  const t = useT()
  
  return (
    <div className="flex flex-col gap-3">
      {decks.map((deck) => (
        <DeckListRow key={deck.id} deck={deck} lang={lang} t={t} globalLimit={globalLimit} />
      ))}
    </div>
  )
}
