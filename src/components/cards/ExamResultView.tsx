"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PracticeQuizCard from "./PracticeQuizCard"
import { XCircle, CheckCircle2 } from "lucide-react"
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
  lang: Lang
  backLink: string
  backLinkText?: string
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
  lang,
  backLink,
  backLinkText,
  originalStats,
  onRetryIncorrect,
  onStudyNewSession
}: ExamResultViewProps) {
  const t = useT()
  const [reviewingCard, setReviewingCard] = useState<CardData | null>(null)

  // Use original stats from DB if available (to prevent distortion from deleted cards)
  const correctCount = originalStats?.correct ?? sessionResults.filter(r => r.isCorrect).length
  const totalCardsCount = originalStats?.total ?? playingCards.length
  const accuracy = originalStats?.score ?? (totalCardsCount > 0 ? Math.round((correctCount / totalCardsCount) * 100) : 0)

  const incorrectIds = sessionResults.filter(r => !r.isCorrect).map(r => r.cardId)

  if (reviewingCard) {
    return (
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex-1 flex flex-col items-center py-4 relative min-h-0">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex justify-center mt-0 sm:mt-8">
            {reviewingCard.type === 'practice_quiz' && (
              <PracticeQuizCard 
                content={reviewingCard.content} 
                mode="review" 
                userSelectedIndices={sessionResults.find(r => r.cardId === reviewingCard.id)?.selectedIndices || []}
                onClose={() => setReviewingCard(null)}
              />
            )}
          </motion.div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto p-4 py-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{t.quiz.quizCompleted}</h2>
        <div className="text-5xl font-black text-teal-400 mt-4">{accuracy}%</div>
        <p className="text-zinc-400 mt-2">{correctCount} / {totalCardsCount} {t.quiz.correctAnswers || "correct"}</p>
      </div>

      <div className="w-full flex flex-col gap-3 mb-8">
        {playingCards.map((c, i) => {
          const res = sessionResults.find(r => r.cardId === c.id)
          const isCorrect = res?.isCorrect
          return (
            <button
              key={c.id}
              onClick={() => setReviewingCard(c)}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition text-left focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </div>
              <div className="flex-1 font-medium text-zinc-300 truncate">
                {i + 1}. {getCardTitle(c)}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full sm:w-auto">
        {incorrectIds.length > 0 && onRetryIncorrect && (
          <button 
            onClick={onRetryIncorrect}
            className="px-8 py-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {t.quiz.retryIncorrect(incorrectIds.length)}
          </button>
        )}
        {onStudyNewSession && (
          <button 
            onClick={onStudyNewSession}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {t.quiz.studyNewSession}
          </button>
        )}
      </div>
      
      <Link href={backLink} className="text-zinc-500 hover:text-zinc-300 transition-colors mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded px-2">
        {backLinkText || t.quiz.backToDashboard}
      </Link>
    </motion.div>
  )
}
