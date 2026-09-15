"use client"

import { useEffect, useState, useCallback } from "react"
import { getLocalCards, getLocalProgressMap, onLocalDbChange } from "@/lib/client-db"
import { selectSessionCards } from "@/lib/session-cards"
import type { RawDbCard } from "@/lib/card-parser"
import { type CardData, isQuizCard } from "@/types/card"
import DeckPlayer from "./DeckPlayer"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useT } from "@/hooks/useT"

interface DeckClientLoaderProps {
  deckId: string
  limit?: number
  isExamMode?: boolean
  lang: string
}

export default function DeckClientLoader({ deckId, limit, isExamMode, lang }: DeckClientLoaderProps) {
  const t = useT()
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<CardData[]>([])
  const [rawCardsCache, setRawCardsCache] = useState<RawDbCard[]>([])
  const [notFoundState, setNotFoundState] = useState(false)

  // Listen for local DB changes (from other tabs or modals) to invalidate card cache
  useEffect(() => {
    const unsubscribe = onLocalDbChange((event) => {
      if (event === "deck_updated" || event === "backup_restored" || event === "deck_created") {
        setRawCardsCache([])
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadLocalDeckData() {
      try {
        let rawCards = await getLocalCards(deckId)
        if (!rawCards || rawCards.length === 0) {
          if (!deckId.startsWith("local_")) {
            try {
              const res = await fetch(`/api/sample-decks/${deckId}`)
              if (res.ok) {
                const data = await res.json()
                rawCards = data.cards || []
              }
            } catch (e) {
              console.warn("Failed to fetch sample deck:", e)
            }
          }
        }

        if (!isMounted) return

        if (!rawCards || rawCards.length === 0) {
          setNotFoundState(true)
          setLoading(false)
          return
        }

        const progressMap = await getLocalProgressMap(deckId)
        if (!isMounted) return

        const validCards = selectSessionCards({
          cards: rawCards,
          progressMap,
          limit,
          isExamMode,
        })

        if (validCards.length === 0) {
          validCards.push({
            id: "error",
            type: "flashcard",
            content: { front: "Error", back: "All cards in this deck contain invalid data format." }
          })
        }

        setRawCardsCache(rawCards)
        setCards(validCards)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load client deck cards:", err)
        if (isMounted) {
          setNotFoundState(true)
          setLoading(false)
        }
      }
    }

    loadLocalDeckData()

    return () => {
      isMounted = false
    }
  }, [deckId, limit, isExamMode])

  const handleNewSession = useCallback(async (): Promise<CardData[]> => {
    // Always check IndexedDB for updated deck cards, falling back to cache if empty
    let sourceCards = await getLocalCards(deckId)
    if (!sourceCards || sourceCards.length === 0) {
      sourceCards = rawCardsCache
    } else {
      setRawCardsCache(sourceCards)
    }

    if (!sourceCards || sourceCards.length === 0) {
      return []
    }

    const progressMap = await getLocalProgressMap(deckId)
    const freshCards = selectSessionCards({
      cards: sourceCards,
      progressMap,
      limit,
      isExamMode,
    })

    if (freshCards.length > 0) {
      setCards(freshCards)
    }

    return freshCards
  }, [rawCardsCache, deckId, limit, isExamMode])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400 gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">{t.local.loadingDeck}</p>
      </div>
    )
  }

  if (notFoundState || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20 shadow-inner">
          <AlertCircle size={32} aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">{t.local.notFoundTitle}</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          {t.local.notFoundDesc}
        </p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary"
        >
          <ArrowLeft size={16} />
          <span>{t.common.backToHome}</span>
        </Link>
      </div>
    )
  }

  const canRunExam = Boolean(isExamMode && cards.some(c => isQuizCard(c)))

  return (
    <DeckPlayer
      deckId={deckId}
      cards={cards}
      mode={canRunExam ? "exam" : "practice"}
      onNewSession={handleNewSession}
    />
  )
}
