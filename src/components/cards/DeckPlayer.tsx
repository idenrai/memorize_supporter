"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Flashcard from "./Flashcard"
import VocabularyCard from "./VocabularyCard"
import PracticeQuizCard from "./PracticeQuizCard"
import ExamResultView from "./ExamResultView"
import QuizHeader from "./QuizHeader"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardData, FlashcardContent } from "@/types/card"
import type { Lang } from "@/i18n/types"
import { updateProgress } from "@/actions/progress"
import { saveExamResult } from "@/actions/exam"
import { useT } from "@/hooks/useT"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface DeckPlayerProps {
  deckId: string
  cards: CardData[]
  mode?: 'practice' | 'exam'
}

export default function DeckPlayer({ deckId, cards, mode = 'practice' }: DeckPlayerProps) {
  const t = useT()
  const params = useParams()
  const lang = params.lang as string || 'en'
  const [playingCards, setPlayingCards] = useState<CardData[]>(cards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [retryRound, setRetryRound] = useState(0)
  const [sessionResults, setSessionResults] = useState<{cardId: string, isCorrect: boolean, selectedIndices?: number[]}[]>([])

  const handleNext = useCallback(async (isCorrect: boolean, selectedIndices?: number[]) => {
    // 防御: Prevent double-click overflow
    if (completed || currentIndex >= playingCards.length) return;

    const card = playingCards[currentIndex]
    
    // 세션 결과 저장
    const newResults = [...sessionResults, { cardId: card.id, isCorrect, selectedIndices }]
    setSessionResults(newResults)
    
    if (mode === 'practice') {
      // Server Action 호출 (UI 블로킹 없이 백그라운드 처리)
      try {
        const result = await updateProgress({ cardId: card.id, isCorrect, deckId })
        if (!result.success) {
          console.error("Failed to update progress:", result.error)
          toast.error(t.common?.error || "Failed to save progress")
        }
      } catch (e) {
        console.error("Server action failed:", e)
        toast.error(t.common?.error || "Failed to save progress")
      }
    }

    if (currentIndex < playingCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      if (mode === 'exam') {
        const correctCount = newResults.filter(r => r.isCorrect).length
        const totalCards = playingCards.length
        const score = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0
        try {
          const result = await saveExamResult({ deckId, score, total: totalCards, correct: correctCount, sessionResults: newResults })
          if (!result.success) {
            console.error("Failed to save exam result:", result.error)
            toast.error(t.common?.error || "Failed to save exam result")
          }
        } catch(e) {
          console.error("Failed to save exam result exception:", e)
          toast.error(t.common?.error || "Failed to save exam result")
        }
      }
      setCompleted(true)
    }
  }, [currentIndex, playingCards, deckId, completed, t.common, mode, sessionResults])

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl text-zinc-400 text-balance">{t.quiz.noCards}</h2>
        <Link href={`/${lang}`} className="mt-4 text-teal-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} aria-hidden="true" /> {t.common.backToHome}
        </Link>
      </div>
    )
  }

  if (completed) {
    const correctCount = sessionResults.filter(r => r.isCorrect).length
    const incorrectIds = sessionResults.filter(r => !r.isCorrect).map(r => r.cardId)
    const accuracy = Math.round((correctCount / playingCards.length) * 100)

    const handleRetryIncorrect = () => {
      // Use playingCards instead of cards to ensure we find the cards from the current session
      const retryCards = playingCards.filter(c => incorrectIds.includes(c.id))
      setPlayingCards(retryCards)
      setCurrentIndex(0)
      setSessionResults([])
      setRetryRound(r => r + 1)
      setCompleted(false)
    }

        const PASS_MARK = parseInt(process.env.NEXT_PUBLIC_PASS_MARK_PERCENT || '80', 10);
        
    if (mode === 'exam') {
      return (
        <ExamResultView
          playingCards={playingCards}
          sessionResults={sessionResults}
          lang={lang as Lang}
          backLink={`/${lang}`}
          onRetryIncorrect={handleRetryIncorrect}
          onStudyNewSession={() => window.location.reload()}
        />
      )
    }

    return (
      <motion.div 
        aria-live="polite"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center space-y-6"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 ${
          accuracy >= PASS_MARK ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {accuracy >= PASS_MARK ? '🎉' : '🎯'}
        </div>
        <h2 className="text-3xl font-bold text-white text-balance">{t.quiz.quizCompleted}</h2>
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 text-center space-y-2">
          <p className="text-4xl font-black text-white">{accuracy}%</p>
          <p className="text-zinc-400">{t.quiz.youScored(correctCount, playingCards.length)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {incorrectIds.length > 0 && (
            <button 
              onClick={handleRetryIncorrect}
              className="px-8 py-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              {t.quiz.retryIncorrect(incorrectIds.length)}
            </button>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {t.quiz.studyNewSession}
          </button>
        </div>
        
        <Link href={`/${lang}`} className="text-zinc-500 hover:text-zinc-300 transition-colors mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded px-2">
          {t.quiz.backToDashboard}
        </Link>
      </motion.div>
    )
  }

  const currentCard = playingCards[currentIndex]

  // 防御: If currentCard is undefined due to rapid double clicking or empty retryCards, prevent crash
  if (!currentCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl text-zinc-400">{t.common.loading}</h2>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Header / Progress - Unified Sticky QuizHeader */}
      <QuizHeader
        backHref={`/${lang}`}
        backLabel={t.common.exit}
        current={currentIndex + 1}
        total={playingCards.length}
        badge={
          retryRound > 0 ? (
            <div className="text-2xs sm:text-xs font-bold text-amber-400 uppercase tracking-widest text-center">
              {t.quiz.retrySessionBadge}
            </div>
          ) : undefined
        }
        animationKey={`progress-${retryRound}-${playingCards.length}`}
      />

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center py-0 sm:py-2 relative min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center mt-2 sm:mt-4 mb-6"
          >
            {currentCard.type === 'flashcard' && (
              <Flashcard 
              content={currentCard.content as FlashcardContent} 
              onNext={handleNext} 
            />
            )}
            {currentCard.type === 'vocabulary' && (
              <VocabularyCard 
                word={currentCard.content.word}
                meaning={currentCard.content.meaning}
                example={currentCard.content.example}
                onNext={handleNext}
              />
            )}
            {currentCard.type === 'practice_quiz' && (
              <PracticeQuizCard 
                content={currentCard.content}
                onNext={handleNext}
                mode={mode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
