"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PracticeQuizCard from "./PracticeQuizCard"
import QuizHeader from "./QuizHeader"
import { XCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { CardData } from "@/types/card"
import { useT } from "@/hooks/useT"
import { Lang } from "@/i18n/types"

interface SessionResult {
  cardId: string
  isCorrect: boolean
  selectedIndices?: number[]
}

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

  useEffect(() => {
    if (!reviewingCard) return

    const reviewingIndex = playingCards.findIndex(c => c.id === reviewingCard.id)
    const hasPrev = reviewingIndex > 0
    const hasNext = reviewingIndex < playingCards.length - 1

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setReviewingCard(null)
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev) {
          e.preventDefault()
          setReviewingCard(playingCards[reviewingIndex - 1])
        }
      } else if (e.key === 'ArrowRight') {
        if (hasNext) {
          e.preventDefault()
          setReviewingCard(playingCards[reviewingIndex + 1])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [reviewingCard, playingCards])

  if (reviewingCard) {
    const reviewingIndex = playingCards.findIndex(c => c.id === reviewingCard.id)
    const currentNum = reviewingIndex >= 0 ? reviewingIndex + 1 : 1
    const hasPrev = reviewingIndex > 0
    const hasNext = reviewingIndex < playingCards.length - 1

    const handlePrevCard = () => {
      if (hasPrev) setReviewingCard(playingCards[reviewingIndex - 1])
    }

    const handleNextCard = () => {
      if (hasNext) setReviewingCard(playingCards[reviewingIndex + 1])
    }

    return (
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
        {/* Reviewing Header / Progress - Unified Sticky QuizHeader */}
        <QuizHeader
          onBack={() => setReviewingCard(null)}
          backLabel={t.quiz.closeReview}
          current={currentNum}
          total={playingCards.length}
          animateProgress={false}
          badge={
            <div className="text-2xs sm:text-xs font-semibold text-indigo-400 tracking-wider text-center">
              {t.quiz.reviewingQuestion(currentNum, playingCards.length)}
            </div>
          }
          rightControls={
            <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700/60">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={handlePrevCard}
                aria-label={t.quiz.prevQuestion}
                title={`${t.quiz.prevQuestion} (←)`}
                className="px-1.5 py-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition rounded flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span className="kbd-badge text-3xs px-1 py-0 hidden md:inline-flex" aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={handleNextCard}
                aria-label={t.quiz.nextQuestion}
                title={`${t.quiz.nextQuestion} (→)`}
                className="px-1.5 py-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition rounded flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <span className="kbd-badge text-3xs px-1 py-0 hidden md:inline-flex" aria-hidden="true">→</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          }
        />

        {/* Reviewing Card Container */}
        <div className="flex-1 flex flex-col items-center py-0 sm:py-2 relative min-h-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={reviewingCard.id}
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center mt-2 sm:mt-4 mb-6"
            >
              {reviewingCard.type === 'practice_quiz' && (
                <PracticeQuizCard 
                  content={reviewingCard.content} 
                  mode="review" 
                  userSelectedIndices={sessionResults.find(r => r.cardId === reviewingCard.id)?.selectedIndices || []}
                  onClose={() => setReviewingCard(null)}
                  onPrevReview={handlePrevCard}
                  onNextReview={handleNextCard}
                  hasPrevReview={hasPrev}
                  hasNextReview={hasNext}
                />
              )}

              {reviewingCard.type === 'flashcard' && (
                <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                  <div>
                    <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700/60">
                      {t.quiz.flashcard}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mt-3 leading-relaxed whitespace-pre-wrap">
                      {reviewingCard.content.front}
                    </h3>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <span className="text-2xs font-semibold text-indigo-400 uppercase tracking-wider">
                      {t.quiz.explanation}
                    </span>
                    <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap">
                      {reviewingCard.content.back}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReviewingCard(null)}
                      className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
                    >
                      <span>{t.quiz.closeReview}</span>
                      <span className="kbd-badge text-3xs px-1.5 py-0.5 ml-0.5" aria-hidden="true">Esc</span>
                    </button>
                  </div>
                </div>
              )}

              {reviewingCard.type === 'vocabulary' && (
                <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                  <div>
                    <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700/60">
                      {t.quiz.vocabulary}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-3 tracking-tight">
                      {reviewingCard.content.word}
                    </h3>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-base sm:text-lg font-medium text-zinc-200 leading-relaxed">
                      {reviewingCard.content.meaning}
                    </p>
                    {reviewingCard.content.example && (
                      <p className="text-sm text-zinc-400 italic mt-3 pt-3 border-t border-zinc-800/60">
                        &quot;{reviewingCard.content.example}&quot;
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReviewingCard(null)}
                      className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
                    >
                      <span>{t.quiz.closeReview}</span>
                      <span className="kbd-badge text-3xs px-1.5 py-0.5 ml-0.5" aria-hidden="true">Esc</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const getCardTitle = (card: CardData) => {
    if (card.type === 'practice_quiz') return card.content.question
    if (card.type === 'vocabulary') return card.content.word
    if (card.type === 'flashcard') return card.content.front
    return t.quiz.unknownCard || 'Unknown Card'
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
                {originalIndex + 1}. {getCardTitle(c)}
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
