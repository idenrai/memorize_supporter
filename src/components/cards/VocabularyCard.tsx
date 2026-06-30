"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useIsPresent } from "framer-motion"
import { Check, X } from "lucide-react"

interface VocabularyCardProps {
  word: string
  meaning: string
  example?: string
  onNext?: (isCorrect: boolean) => void
}

export default function VocabularyCard({ word, meaning, example, onNext }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFeedback, setIsFeedback] = useState<"correct" | "incorrect" | null>(null)
  const isPresent = useIsPresent()

  const handleFlip = useCallback(() => {
    if (!isFlipped && !isFeedback) {
      setIsFlipped(true)
    }
  }, [isFlipped, isFeedback])

  const handleFeedback = useCallback((type: "correct" | "incorrect") => {
    if (!isFlipped || isFeedback) return

    setIsFeedback(type)
    
    setTimeout(() => {
      onNext?.(type === "correct")
    }, 400)
  }, [isFlipped, isFeedback, onNext])

  // Keyboard Navigation: Any key to flip (if not flipped), Arrows to rate
  useEffect(() => {
    if (!isPresent) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if typing in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (!isFlipped) {
        e.preventDefault()
        handleFlip()
      } else {
        if (e.code === 'ArrowLeft' && !isFeedback) {
          e.preventDefault()
          handleFeedback("incorrect")
        } else if (e.code === 'ArrowRight' && !isFeedback) {
          e.preventDefault()
          handleFeedback("correct")
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFlip, handleFeedback, isFlipped, isFeedback, isPresent])

  return (
    <div className="w-full max-w-2xl h-80 perspective-1000 select-none">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0, scale: isFeedback ? 1.02 : 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => {
          if (!isFlipped) handleFlip()
        }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-[#1c1f26] border border-gray-800 rounded-2xl shadow-xl flex flex-col p-8 items-center justify-center hover:bg-[#232730] transition-colors">
          <div className="absolute top-6 left-8 text-xs font-semibold text-purple-500 uppercase tracking-wider">
            Vocabulary
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-100 leading-relaxed tracking-tight">
            {word}
          </h2>
          <div className="absolute bottom-6 text-sm text-gray-500 animate-pulse">
            Press any key to reveal
          </div>
        </div>

        {/* Back of the card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 border border-gray-800 rounded-2xl shadow-xl flex flex-col p-8 justify-center
            ${isFeedback === 'correct' ? 'bg-green-900/30 border-green-500/50' : 
              isFeedback === 'incorrect' ? 'bg-red-900/30 border-red-500/50' : 'bg-[#1c1f26]'}`}
        >
          <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-4">{meaning}</h3>
            {example && (
              <p className="text-lg text-gray-400 italic text-center mt-2 border-t border-gray-800/50 pt-4 w-full">
                "{example}"
              </p>
            )}
          </div>
          
          <div className="h-16 flex items-center justify-center gap-6 pt-4 border-t border-gray-800/50 mt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("incorrect")
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <X size={18} />
              <span>Hard (←)</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("correct")
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
            >
              <Check size={18} />
              <span>Easy (→)</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
