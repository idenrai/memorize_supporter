"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useIsPresent } from "framer-motion"
import { Check, X } from "lucide-react"
import { FlashcardContent } from "@/types/card"
import { useT } from "@/hooks/useT"
import { formatText } from "@/lib/format"

interface FlashcardProps {
  content: FlashcardContent
  onNext?: (isCorrect: boolean) => void
}

export default function Flashcard({ content: { front, back, category }, onNext }: FlashcardProps) {
  const t = useT()
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

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPresent) {
      containerRef.current?.focus()
    }
  }, [isPresent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isPresent) return

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

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-2xl h-80 perspective-1000 select-none font-sans antialiased focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500/50 rounded-2xl"
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0, scale: isFeedback ? 1.02 : 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        onClick={handleFlip}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col p-8 items-center justify-center hover:border-zinc-700/80 transition-colors duration-300">
          {category && (
            <div className="absolute top-6 left-8 text-xs font-semibold text-teal-500 uppercase tracking-wider">
              {t.quiz.flashcard}
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-medium text-center text-zinc-200 leading-relaxed whitespace-pre-wrap text-balance tracking-wide">
            {formatText(front)}
          </h2>
          <div className="absolute bottom-6 text-sm text-zinc-500 animate-pulse">
            {t.quiz.clickToReveal}
          </div>
        </div>

        {/* Back of the card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 border rounded-2xl shadow-2xl flex flex-col p-8 justify-center
            ${isFeedback === 'correct' ? 'bg-zinc-900 border-emerald-600/40' : 
              isFeedback === 'incorrect' ? 'bg-zinc-900 border-rose-600/40' : 'bg-zinc-900 border-zinc-800'}`}
        >
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <p className="text-xl md:text-2xl font-light text-center text-zinc-300 leading-relaxed whitespace-pre-wrap text-balance tracking-wide">
              {formatText(back)}
            </p>
          </div>
          
          <div className="h-16 flex items-center justify-center gap-6 pt-4 border-t border-zinc-800/80 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("incorrect")
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 font-medium"
            >
              <X size={18} aria-hidden="true" />
              <span>{t.quiz.hard}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("correct")
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 font-medium"
            >
              <Check size={18} aria-hidden="true" />
              <span>{t.quiz.easy}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
