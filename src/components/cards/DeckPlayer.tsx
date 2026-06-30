"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Flashcard from "./Flashcard"
import VocabularyCard from "./VocabularyCard"
import PracticeQuizCard from "./PracticeQuizCard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardData } from "@/types/card"
import { updateProgress } from "@/app/actions/progress"

interface DeckPlayerProps {
  deckId: string
  cards: CardData[]
}

export default function DeckPlayer({ deckId, cards }: DeckPlayerProps) {
  const [playingCards, setPlayingCards] = useState<CardData[]>(cards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [sessionResults, setSessionResults] = useState<{cardId: string, isCorrect: boolean}[]>([])

  const handleNext = useCallback(async (isCorrect: boolean) => {
    // 防御: Prevent double-click overflow
    if (completed || currentIndex >= playingCards.length) return;

    const card = playingCards[currentIndex]
    
    // 세션 결과 저장
    setSessionResults(prev => [...prev, { cardId: card.id, isCorrect }])
    
    // Server Action 호출 (UI 블로킹 없이 백그라운드 처리)
    try {
      const result = await updateProgress(card.id, isCorrect, deckId)
      if (!result.success) {
        console.error("Failed to update progress:", result.error)
        // Optionally show toast or notification here
      }
    } catch (e) {
      console.error("Server action failed:", e)
    }

    if (currentIndex < playingCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
    }
  }, [currentIndex, playingCards, deckId, completed])

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl text-gray-400">No cards found in this deck.</h2>
        <Link href="/" className="mt-4 text-blue-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
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
      setCompleted(false)
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center space-y-6"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 ${
          accuracy >= 80 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {accuracy >= 80 ? '🎉' : '🎯'}
        </div>
        <h2 className="text-3xl font-bold text-white">Quiz Completed!</h2>
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 text-center space-y-2">
          <p className="text-4xl font-black text-white">{accuracy}%</p>
          <p className="text-gray-400">You scored {correctCount} out of {playingCards.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {incorrectIds.length > 0 && (
            <button 
              onClick={handleRetryIncorrect}
              className="px-8 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-full font-medium transition-colors"
            >
              Retry {incorrectIds.length} Incorrect
            </button>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            Study New Session
          </button>
        </div>
        
        <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors mt-4">
          Back to Dashboard
        </Link>
      </motion.div>
    )
  }

  const currentCard = playingCards[currentIndex]

  // 防御: If currentCard is undefined due to rapid double clicking or empty retryCards, prevent crash
  if (!currentCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl text-gray-400">Loading next card...</h2>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Header / Progress */}
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="hidden md:inline">Exit</span>
        </Link>
        <div className="flex-1 max-w-md mx-8">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / playingCards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="text-gray-400 font-medium tabular-nums">
          {currentIndex + 1} <span className="text-gray-600">/ {playingCards.length}</span>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            {currentCard.type === 'flashcard' && (
              <Flashcard 
                front={currentCard.content.front}
                back={currentCard.content.back}
                category={currentCard.content.category}
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
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
