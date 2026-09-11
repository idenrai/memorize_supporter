"use client"

import { useEffect, useState } from "react"
import { getLocalCards, getLocalProgressMap } from "@/lib/client-db"
import { parseCardDataList } from "@/lib/card-parser"
import type { CardData } from "@/types/card"
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

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function DeckClientLoader({ deckId, limit, isExamMode, lang }: DeckClientLoaderProps) {
  const t = useT()
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<CardData[]>([])
  const [notFoundState, setNotFoundState] = useState(false)

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

        // Sort by priority (same algorithm as server)
        const mapped = rawCards.map((card) => {
          let category = 3
          let failedCount = 0
          const p = progressMap[card.id]

          if (!p || p.reviewCount === 0) {
            category = 1
          } else if (p.successRate !== null && p.successRate < 1) {
            category = 2
            const rate = p.successRate || 0
            failedCount = Math.round(p.reviewCount * (1 - rate))
          }

          const dateValue = p?.nextReviewAt ? p.nextReviewAt.getTime() : Infinity
          const reviewCount = p?.reviewCount || 0

          return { card, category, failedCount, reviewCount, dateValue }
        })

        mapped.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category - b.category
          }
          if (a.category === 2) {
            if (a.failedCount !== b.failedCount) {
              return b.failedCount - a.failedCount
            }
          } else if (a.category === 3) {
            if (a.reviewCount !== b.reviewCount) {
              return a.reviewCount - b.reviewCount
            }
          }
          return a.dateValue - b.dateValue
        })

        const sortedRaw = mapped.map((item) => item.card)
        const limitedCards = limit ? sortedRaw.slice(0, limit) : sortedRaw
        const shuffledCards = shuffle(limitedCards)
        const validCards = parseCardDataList(shuffledCards)

        if (validCards.length === 0) {
          validCards.push({
            id: "error",
            type: "flashcard",
            content: { front: "Error", back: "All cards in this deck contain invalid data format." }
          })
        }

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
  }, [deckId, limit])

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
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-inner">
          <AlertCircle size={32} aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">{t.local.notFoundTitle}</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          {t.local.notFoundDesc}
        </p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold btn-indigo shadow-lg shadow-indigo-500/20"
        >
          <ArrowLeft size={16} />
          <span>{t.common.backToHome}</span>
        </Link>
      </div>
    )
  }

  return (
    <DeckPlayer
      deckId={deckId}
      cards={cards}
      mode={isExamMode ? "exam" : "practice"}
    />
  )
}
