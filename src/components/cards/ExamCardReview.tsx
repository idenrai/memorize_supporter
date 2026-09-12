"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PracticeQuizCard from "./PracticeQuizCard"
import QuizHeader from "./QuizHeader"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CardData } from "@/types/card"
import { useT } from "@/hooks/useT"

export interface SessionResult {
  cardId: string
  isCorrect: boolean
  selectedIndices?: number[]
}

interface ExamCardReviewProps {
  reviewingCard: CardData
  playingCards: CardData[]
  sessionResults: SessionResult[]
  onClose: () => void
  onSelectCard: (card: CardData) => void
}

export default function ExamCardReview({
  reviewingCard,
  playingCards,
  sessionResults,
  onClose,
  onSelectCard,
}: ExamCardReviewProps) {
  const t = useT()

  const reviewingIndex = playingCards.findIndex((c) => c.id === reviewingCard.id)
  const currentNum = reviewingIndex >= 0 ? reviewingIndex + 1 : 1
  const hasPrev = reviewingIndex > 0
  const hasNext = reviewingIndex < playingCards.length - 1

  const handlePrevCard = useCallback(() => {
    if (hasPrev) onSelectCard(playingCards[reviewingIndex - 1])
  }, [hasPrev, onSelectCard, playingCards, reviewingIndex])

  const handleNextCard = useCallback(() => {
    if (hasNext) onSelectCard(playingCards[reviewingIndex + 1])
  }, [hasNext, onSelectCard, playingCards, reviewingIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowLeft") {
        if (hasPrev) {
          e.preventDefault()
          handlePrevCard()
        }
      } else if (e.key === "ArrowRight") {
        if (hasNext) {
          e.preventDefault()
          handleNextCard()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [hasPrev, hasNext, onClose, handlePrevCard, handleNextCard])

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Reviewing Header / Progress - Unified Sticky QuizHeader */}
      <QuizHeader
        onBack={onClose}
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
              <span
                className="kbd-badge text-3xs px-1 py-0 hidden md:inline-flex"
                aria-hidden="true"
              >
                ←
              </span>
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={handleNextCard}
              aria-label={t.quiz.nextQuestion}
              title={`${t.quiz.nextQuestion} (→)`}
              className="px-1.5 py-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition rounded flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <span
                className="kbd-badge text-3xs px-1 py-0 hidden md:inline-flex"
                aria-hidden="true"
              >
                →
              </span>
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
            {reviewingCard.type === "practice_quiz" && (
              <PracticeQuizCard
                content={reviewingCard.content}
                mode="review"
                userSelectedIndices={
                  sessionResults.find((r) => r.cardId === reviewingCard.id)
                    ?.selectedIndices || []
                }
                onClose={onClose}
                onPrevReview={handlePrevCard}
                onNextReview={handleNextCard}
                hasPrevReview={hasPrev}
                hasNextReview={hasNext}
              />
            )}

            {reviewingCard.type === "flashcard" && (
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
                    onClick={onClose}
                    className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>{t.quiz.closeReview}</span>
                    <span
                      className="kbd-badge text-3xs px-1.5 py-0.5 ml-0.5"
                      aria-hidden="true"
                    >
                      Esc
                    </span>
                  </button>
                </div>
              </div>
            )}

            {reviewingCard.type === "vocabulary" && (
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
                    onClick={onClose}
                    className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>{t.quiz.closeReview}</span>
                    <span
                      className="kbd-badge text-3xs px-1.5 py-0.5 ml-0.5"
                      aria-hidden="true"
                    >
                      Esc
                    </span>
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
