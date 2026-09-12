"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ExamCardReview, { type SessionResult } from "./ExamCardReview"
import { XCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import type { CardData } from "@/types/card"
import { getCardTitle } from "@/lib/card-parser"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"

export type { SessionResult }

interface ExamResultViewProps {
  playingCards: CardData[]
  sessionResults: SessionResult[]
  lang?: Lang
  backLink: string
  backLinkText?: string
  isHistoricalReview?: boolean
  originalStats?: {
    score: number
    total: number
    correct: number
  }
  onRetryIncorrect?: () => void
  onStudyNewSession?: () => void
}

export default function ExamResultView({
  playingCards,
  sessionResults,
  backLink,
  backLinkText,
  isHistoricalReview = false,
  originalStats,
  onRetryIncorrect,
  onStudyNewSession
}: ExamResultViewProps) {
  const t = useT()
  const [reviewingCard, setReviewingCard] = useState<CardData | null>(null)
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect'>('all')

  // Use original stats from DB if available (to prevent distortion from deleted cards)
  const correctCount = originalStats?.correct ?? sessionResults.filter(r => r.isCorrect).length
  const totalCardsCount = originalStats?.total ?? playingCards.length
  const accuracy = originalStats?.score ?? (totalCardsCount > 0 ? Math.round((correctCount / totalCardsCount) * 100) : 0)

  const incorrectIds = sessionResults.filter(r => !r.isCorrect).map(r => r.cardId)

  // Filter questions for display
  const displayedCards = filterMode === 'incorrect'
    ? playingCards.filter(c => incorrectIds.includes(c.id))
    : playingCards

  if (reviewingCard) {
    return (
      <ExamCardReview
        reviewingCard={reviewingCard}
        playingCards={playingCards}
        sessionResults={sessionResults}
        onClose={() => setReviewingCard(null)}
        onSelectCard={setReviewingCard}
      />
    )
  }

  return (
    <motion.div 
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto p-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2">
          {isHistoricalReview ? t.records.examReviewTitle : t.quiz.quizCompleted}
        </h2>
        <div className="text-5xl font-extrabold text-zinc-100 mt-4 tabular-nums">{accuracy}%</div>
        <p className="text-sm text-zinc-400 mt-2">
          <span className="tabular-nums font-semibold text-zinc-200">{correctCount}</span> / <span className="tabular-nums font-semibold text-zinc-200">{totalCardsCount}</span> {t.quiz.correctAnswers}
        </p>
      </div>

      {/* Filter Tabs (All vs Incorrect Only) */}
      {incorrectIds.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 sm:flex-initial text-center ${
              filterMode === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.records.filterAll} ({playingCards.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 sm:flex-initial text-center ${
              filterMode === 'incorrect'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.records.filterIncorrect} ({incorrectIds.length})
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="w-full flex flex-col gap-2.5 mb-8">
        {displayedCards.map((c) => {
          const originalIndex = playingCards.findIndex(item => item.id === c.id)
          const res = sessionResults.find(r => r.cardId === c.id)
          const isCorrect = res?.isCorrect
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setReviewingCard(c)}
              className="flex items-center gap-3.5 p-3.5 rounded-xl card-interactive text-left focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                {isCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
              </div>
              <div className="flex-1 font-medium text-zinc-300 text-sm truncate">
                {originalIndex + 1}. {getCardTitle(c, t.quiz.unknownCard)}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full sm:w-auto">
        {incorrectIds.length > 0 && onRetryIncorrect && (
          <button 
            type="button"
            onClick={onRetryIncorrect}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold btn-secondary text-center"
          >
            {t.quiz.retryIncorrect(incorrectIds.length)}
          </button>
        )}
        {onStudyNewSession && (
          <button 
            type="button"
            onClick={onStudyNewSession}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold btn-primary text-center"
          >
            {t.quiz.studyNewSession}
          </button>
        )}
      </div>
      
      <Link href={backLink} className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors mt-2">
        {backLinkText || t.quiz.backToDashboard}
      </Link>
    </motion.div>
  )
}
