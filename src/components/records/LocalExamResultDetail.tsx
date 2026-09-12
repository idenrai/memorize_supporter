"use client"

import { useEffect, useState } from "react"
import { getLocalExamResult, getLocalCards, type LocalExamResult } from "@/lib/client-db"
import { parseCardDataList } from "@/lib/card-parser"
import type { CardData } from "@/types/card"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import ExamResultView from "@/components/cards/ExamResultView"
import { Trophy, ArrowLeft, Calendar, FileText } from "lucide-react"
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
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 text-zinc-500">
          <Trophy size={24} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-zinc-300 mb-2">{t.records.empty}</h3>
        <Link
          href={`/${lang}/records`}
          className="mt-4 px-5 py-2 btn-secondary rounded-xl text-xs font-semibold"
        >
          {t.records.backToRecords}
        </Link>
      </main>
    )
  }

  if (playingCards.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 text-zinc-500">
          <ArrowLeft size={20} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-zinc-300 mb-2">
          {t.records.detailsNotAvailable}
        </h3>
        <p className="text-zinc-500 mb-6 max-w-md text-center text-xs leading-relaxed font-normal">
          {t.records.legacyRecordDesc}
        </p>
        <Link
          href={`/${lang}/records`}
          className="px-5 py-2 btn-secondary rounded-xl text-xs font-semibold"
        >
          {t.records.backToRecords}
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16 flex flex-col">
      {/* Session Breadcrumb & Metadata Card */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <Link
          href={`/${lang}/records`}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>{t.records.backToRecords}</span>
        </Link>

        <div className="flex items-center gap-3 flex-wrap text-2xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-zinc-600" aria-hidden="true" />
            {new Date(record.createdAt).toLocaleString(lang, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1">
            <FileText size={12} className="text-zinc-600" aria-hidden="true" />
            {record.deckId}
          </span>
        </div>
      </div>

      <ExamResultView
        playingCards={playingCards}
        sessionResults={record.details}
        lang={lang}
        backLink={`/${lang}/records`}
        backLinkText={t.records.backToRecords}
        isHistoricalReview={true}
        originalStats={{
          score: record.score,
          total: record.total,
          correct: record.correct
        }}
      />
    </main>
  )
}
