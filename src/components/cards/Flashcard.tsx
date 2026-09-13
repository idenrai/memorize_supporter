"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useIsPresent } from "framer-motion"
import { FlashcardContent } from "@/types/card"
import { useT } from "@/hooks/useT"
import { formatText } from "@/lib/format"
import CardFeedbackActions from "./CardFeedbackActions"

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

  const handlersRef = useRef({
    isFlipped,
    isFeedback,
    handleFlip,
    handleFeedback,
  })

  useEffect(() => {
    handlersRef.current = {
      isFlipped,
      isFeedback,
      handleFlip,
      handleFeedback,
    }
  })

  useEffect(() => {
    if (!isPresent) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      const h = handlersRef.current

      if (!h.isFlipped) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault()
          h.handleFlip()
        }
      } else {
        if ((e.code === 'ArrowLeft' || e.key === 'ArrowLeft') && !h.isFeedback) {
          e.preventDefault()
          h.handleFeedback("incorrect")
        } else if ((e.code === 'ArrowRight' || e.key === 'ArrowRight') && !h.isFeedback) {
          e.preventDefault()
          h.handleFeedback("correct")
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isPresent])

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      className="w-full max-w-2xl h-80 perspective-1000 select-none font-sans antialiased focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-2xl"
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0, scale: isFeedback ? 1.02 : 1 }}
        transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
        onClick={handleFlip}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl flex flex-col p-6 sm:p-8 items-center justify-between hover:border-zinc-700 transition-colors">
          <div className="w-full flex items-center justify-between">
            {category ? (
              <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700/60">
                {t.quiz.flashcard}
              </span>
            ) : <span />}
            <span className="flex items-center gap-1 text-2xs text-zinc-500">
              <span className="kbd-badge">Space</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-zinc-100 leading-relaxed whitespace-pre-wrap text-balance my-auto">
            {formatText(front)}
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
          <div className="flex-1 flex items-center justify-center overflow-y-auto my-auto py-2">
            <p className="text-lg sm:text-xl md:text-2xl font-normal text-center text-zinc-200 leading-relaxed whitespace-pre-wrap text-balance">
              {formatText(back)}
            </p>
          </div>
          
          <CardFeedbackActions
            onFeedback={handleFeedback}
            disabled={Boolean(isFeedback)}
          />
        </div>
      </motion.div>
    </div>
  )
}
