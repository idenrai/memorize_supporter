"use client"

import { useEffect, useState } from "react"
import { getLocalExamResult, getLocalCards, type LocalExamResult } from "@/lib/client-db"
import { parseCardDataList } from "@/lib/card-parser"
import type { CardData } from "@/types/card"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import ExamResultView from "@/components/cards/ExamResultView"
import { Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LocalExamResultDetailProps {
  examId: string
  lang: Lang
}

export default function LocalExamResultDetail({ examId, lang }: LocalExamResultDetailProps) {
  const t = useT()
  const [loading, setLoading] = useState(true)
  const [record, setRecord] = useState<LocalExamResult | null>(null)
  const [playingCards, setPlayingCards] = useState<CardData[]>([])

  useEffect(() => {
    let isCancelled = false

    async function load() {
      try {
        const found = await getLocalExamResult(examId)
        if (isCancelled) return
        if (!found) {
          setLoading(false)
          return
        }

        setRecord(found)

        let rawCards: { id: string; type: string; content: string }[] = []
        if (found.deckId.startsWith("local_")) {
          rawCards = await getLocalCards(found.deckId)
        } else {
          // Fetch sample deck cards from API
          try {
            const res = await fetch(`/api/sample-decks/${found.deckId}`)
            if (res.ok) {
              const data = await res.json()
              rawCards = data.cards || []
            }
          } catch (e) {
            console.warn("Failed to fetch sample deck cards for exam review", e)
          }
        }

        if (isCancelled) return

        const cardMap = new Map<string, CardData>()
        const parsed = parseCardDataList(rawCards)
        for (const c of parsed) {
          cardMap.set(c.id, c)
        }

        // Filter cards that were in this exam session
        const sessionCards: CardData[] = []
        for (const d of found.details) {
          const c = cardMap.get(d.cardId)
          if (c) {
            sessionCards.push(c)
          }
        }

        setPlayingCards(sessionCards)
      } catch (err) {
        console.error("Failed to load exam detail", err)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    load()

    return () => {
      isCancelled = true
    }
  }, [examId])

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!record) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <Trophy size={48} className="text-zinc-700 mb-6" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-zinc-400 mb-2">{t.records?.empty || "No records found"}</h3>
        <Link
          href={`/${lang}/records`}
          className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors"
        >
          {t.records?.backToRecords || "Back to Records"}
        </Link>
      </main>
    )
  }

  if (playingCards.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft size={24} className="text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">
          {t.records?.detailsNotAvailable || "Details not available"}
        </h3>
        <p className="text-zinc-500 mb-8 max-w-md text-center">
          {t.records?.legacyRecordDesc || "Question history for this session cannot be displayed."}
        </p>
        <Link
          href={`/${lang}/records`}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors"
        >
          {t.records?.backToRecords || "Back to Records"}
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
      <ExamResultView
        playingCards={playingCards}
        sessionResults={record.details}
        lang={lang}
        backLink={`/${lang}/records`}
        backLinkText={t.records?.backToRecords || "Back to Records"}
        originalStats={{
          score: record.score,
          total: record.total,
          correct: record.correct
        }}
      />
    </main>
  )
}
