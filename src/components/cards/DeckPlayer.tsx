"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Flashcard from "./Flashcard"
import VocabularyCard from "./VocabularyCard"
import MultipleChoiceQuizCard from "./MultipleChoiceQuizCard"
import ExamResultView from "./ExamResultView"
import QuizHeader from "./QuizHeader"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardData, FlashcardContent, isQuizCard } from "@/types/card"
import type { Lang } from "@/i18n/types"
import { updateLocalProgress, saveLocalExamResult } from "@/lib/client-db"
import { useT } from "@/hooks/useT"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface DeckPlayerProps {
  deckId: string
  cards: CardData[]
  mode?: 'practice' | 'exam'
  onNewSession?: () => Promise<CardData[]> | CardData[]
}

export default function DeckPlayer({ deckId, cards, mode = 'practice', onNewSession }: DeckPlayerProps) {
  const t = useT()
  const params = useParams()
  const lang = params.lang as string || 'en'
  const [playingCards, setPlayingCards] = useState<CardData[]>(cards)
  const [isReloading, setIsReloading] = useState(false)
  const inFlightRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [retryRound, setRetryRound] = useState(0)
  const [sessionResults, setSessionResults] = useState<{cardId: string, isCorrect: boolean, selectedIndices?: number[]}[]>([])

  const [prevCards, setPrevCards] = useState(cards)
  if (cards !== prevCards) {
    setPrevCards(cards)
    setPlayingCards(cards)
  }

  const handleNext = useCallback(async (isCorrect: boolean, selectedIndices?: number[]) => {
    // Prevent double-click overflow
    if (completed || currentIndex >= playingCards.length) return;

    const card = playingCards[currentIndex]
    
    // Save session results
    const newResults = [...sessionResults, { cardId: card.id, isCorrect, selectedIndices }]
    setSessionResults(newResults)
    
    if (mode === 'practice') {
      try {
        await updateLocalProgress(card.id, deckId, isCorrect)
      } catch (e) {
        console.error("Progress save failed:", e)
        toast.error(t.common.error)
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
          await saveLocalExamResult({
            deckId,
            score,
            total: totalCards,
            correct: correctCount,
            details: newResults.map(r => ({
              cardId: r.cardId,
              isCorrect: r.isCorrect,
              selectedIndices: r.selectedIndices
            }))
          })
        } catch(e) {
          console.error("Failed to save exam result exception:", e)
          toast.error(t.common.error)
        }
      }
      setCompleted(true)
    }
  }, [currentIndex, playingCards, deckId, completed, t.common, mode, sessionResults])

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl text-zinc-400 text-balance">{t.quiz.noCards}</h2>
        <Link href={`/${lang}`} className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
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

    const handleStudyNewSession = async () => {
      if (inFlightRef.current) return
      inFlightRef.current = true
      setIsReloading(true)

      try {
        if (onNewSession) {
          const freshCards = await onNewSession()
          if (freshCards && freshCards.length > 0) {
            setPlayingCards(freshCards)
            setCurrentIndex(0)
            setSessionResults([])
            setRetryRound(0)
            setCompleted(false)
            return
          }
        }
        setPlayingCards(cards)
        setCurrentIndex(0)
        setSessionResults([])
        setRetryRound(0)
        setCompleted(false)
      } catch (err) {
        console.error("Failed to reload fresh session cards:", err)
        setPlayingCards(cards)
        setCurrentIndex(0)
        setSessionResults([])
        setRetryRound(0)
        setCompleted(false)
      } finally {
        inFlightRef.current = false
        setIsReloading(false)
      }
    }

    if (mode === 'exam') {
      return (
        <ExamResultView
          playingCards={playingCards}
          sessionResults={sessionResults}
          lang={lang as Lang}
          backLink={`/${lang}`}
          onRetryIncorrect={handleRetryIncorrect}
          onStudyNewSession={handleStudyNewSession}
          isReloading={isReloading}
        />
      )
    }

    return (
      <motion.div 
        aria-live="polite"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-5 max-w-md mx-auto w-full py-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 text-center tracking-tight">
          {t.quiz.quizCompleted}
        </h2>

        <div className="card-precision p-6 sm:p-8 text-center flex flex-col gap-1.5 w-full">
          <p className="text-4xl sm:text-5xl font-extrabold text-zinc-100 tabular-nums">
            {accuracy}%
          </p>
          <p className="text-sm text-zinc-400">
            {t.quiz.youScored(correctCount, playingCards.length)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-3">
          {incorrectIds.length > 0 && (
            <button 
              type="button"
              onClick={handleRetryIncorrect}
              className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold btn-secondary text-center"
            >
              {t.quiz.retryIncorrect(incorrectIds.length)}
            </button>
          )}
          <button 
            type="button"
            onClick={handleStudyNewSession}
            disabled={isReloading}
            className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.quiz.studyNewSession}
          </button>
        </div>
        
        <Link 
          href={`/${lang}`} 
          className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
        >
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
            {isQuizCard(currentCard) && (
              <MultipleChoiceQuizCard 
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
