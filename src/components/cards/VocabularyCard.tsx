"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useIsPresent } from "framer-motion"
import { Check, X } from "lucide-react"
import { useT } from "@/hooks/useT"
import { formatText } from "@/lib/format"

interface VocabularyCardProps {
  word: string
  meaning: string
  example?: string
  onNext?: (isCorrect: boolean) => void
}

export default function VocabularyCard({ word, meaning, example, onNext }: VocabularyCardProps) {
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

  // Keyboard Navigation: Any key to flip (if not flipped), Arrows to rate
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
      className="w-full max-w-2xl h-80 perspective-1000 select-none font-sans antialiased focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-2xl"
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0, scale: isFeedback ? 1.02 : 1 }}
        transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => {
          if (!isFlipped) handleFlip()
        }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl flex flex-col p-6 sm:p-8 items-center justify-between hover:border-zinc-700 transition-colors">
          <div className="w-full flex items-center justify-between">
            <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700/60">
              {t.quiz.vocabulary}
            </span>
            <span className="flex items-center gap-1 text-2xs text-zinc-500">
              <span className="kbd-badge">Space</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-zinc-100 leading-relaxed tracking-tight text-balance whitespace-pre-wrap my-auto">
            {formatText(word)}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <span>{t.quiz.pressSpaceOrClick}</span>
          </div>
        </div>

        {/* Back of the card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 border rounded-2xl shadow-xl flex flex-col p-6 sm:p-8 justify-between transition-colors
            ${isFeedback === 'correct' ? 'bg-zinc-900 border-emerald-500/50' : 
              isFeedback === 'incorrect' ? 'bg-zinc-900 border-rose-500/50' : 'bg-zinc-900 border-zinc-800'}`}
        >
          <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4 my-auto py-2">
            <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mb-3 whitespace-pre-wrap text-balance text-center tracking-wide">
              {formatText(meaning)}
            </h3>
            {example && (
              <p className="text-sm sm:text-base text-zinc-400 italic text-center mt-2 border-t border-zinc-800 pt-3 w-full whitespace-pre-wrap text-balance font-normal">
                &quot;{formatText(example)}&quot;
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-800">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("incorrect")
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 text-xs sm:text-sm font-semibold"
            >
              <X size={16} aria-hidden="true" />
              <span>{t.quiz.hard}</span>
              <span className="kbd-badge ml-1">←</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFeedback("correct")
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 text-xs sm:text-sm font-semibold"
            >
              <Check size={16} aria-hidden="true" />
              <span>{t.quiz.easy}</span>
              <span className="kbd-badge ml-1">→</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
