"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { PracticeQuizContent } from "@/types/card"
import { CheckCircle2, XCircle, Bot } from "lucide-react"
import { motion, AnimatePresence, useIsPresent, useReducedMotion } from "framer-motion"
import { useT } from "@/hooks/useT"
import { formatText } from "@/lib/format"
import { toast } from "sonner"

interface Props {
  content: PracticeQuizContent
  onNext?: (isCorrect: boolean, selectedIndices?: number[]) => void
  onClose?: () => void
  mode?: 'practice' | 'exam' | 'review'
  userSelectedIndices?: number[]
}

export default function PracticeQuizCard({ content, onNext, onClose, mode = 'practice', userSelectedIndices = [] }: Props) {
  const t = useT()
  const [selectedIndices, setSelectedIndices] = useState<number[]>(userSelectedIndices)
  const [isFlipped, setIsFlipped] = useState(mode === 'review')
  
  const isPresent = useIsPresent()
  const shouldReduceMotion = useReducedMotion()
  
  const isSingleChoice = content.answers.length === 1

  // Calculate if the selected answer is correct
  const isCorrect = 
    selectedIndices.length === content.answers.length &&
    selectedIndices.every(i => content.answers.includes(i))

  const toggleSelection = (index: number) => {
    if (isFlipped) return // Cannot change after submit

    if (isSingleChoice) {
      setSelectedIndices([index])
    } else {
      setSelectedIndices(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    }
  }

  const handleSubmit = useCallback(() => {
    if (selectedIndices.length === 0 || isFlipped) return
    if (mode === 'exam') {
      onNext?.(isCorrect, selectedIndices)
    } else {
      setIsFlipped(true)
    }
  }, [selectedIndices, isFlipped, mode, isCorrect, onNext])

  const handleNext = useCallback(() => {
    if (!isFlipped || mode === 'review') return
    onNext?.(isCorrect, selectedIndices)
  }, [isFlipped, isCorrect, onNext, mode, selectedIndices])

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const optionsText = content.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')
    const prompt = t.quiz.aiDeepPrompt(content.question, optionsText, content.explanation || t.quiz.none)

    try {
      await navigator.clipboard.writeText(prompt)
      toast.success(t.quiz.promptCopied)
    } catch {
      toast.error(t.quiz.promptCopyFailed)
    }
  }

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intentionally left empty: Auto-focus on mount was removed 
    // to improve accessibility and not steal focus from keyboard users
  }, [isPresent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    if (mode === 'review') {
      if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        onClose?.()
      }
      return
    }

    if (!isPresent) return

    if (!isFlipped) {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        handleSubmit()
      }
    } else {
      if (e.key === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-4xl select-none font-sans antialiased focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 rounded-2xl"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isFlipped ? (
          /* FRONT SIDE (Question & Options) */
          <motion.div
            key="question-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="w-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl transition duration-300 hover:border-zinc-700/80"
          >
            <div className="text-xs font-medium text-zinc-400 mb-4 tracking-widest uppercase flex items-center justify-between min-w-0">
              <span className="truncate min-w-0 max-w-[180px] sm:max-w-[300px] text-teal-500">{content.category || t.quiz.practiceQuiz}</span>
              <span className="text-zinc-500 shrink-0 ml-2">
                {content.answers.length > 1 ? t.quiz.selectMultiple(content.answers.length) : t.quiz.selectOne}
              </span>
            </div>
            
            <h2 className={`${content.question.length > 300 ? 'text-sm sm:text-base' : content.question.length > 150 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-semibold text-zinc-200 mb-6 flex-shrink-0 leading-relaxed whitespace-pre-wrap text-balance tracking-wide`}>
              {formatText(content.question)}
            </h2>

            <div className="flex flex-col gap-3">
              {content.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => toggleSelection(i)}
                  className={`text-left px-5 py-4 rounded-xl border transition duration-200 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 text-sm sm:text-base active:scale-[0.99] ${
                    selectedIndices.includes(i) 
                      ? 'border-teal-600 bg-teal-600/10 text-teal-200 shadow-sm shadow-teal-900/10' 
                      : 'border-zinc-800 hover:border-zinc-700 text-zinc-300 bg-zinc-800/30 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 border transition-colors ${
                    isSingleChoice ? 'rounded-full' : 'rounded'
                  } ${
                    selectedIndices.includes(i) ? 'border-teal-600 bg-teal-600 text-white' : 'border-zinc-600'
                  }`}>
                    {selectedIndices.includes(i) && <CheckCircle2 size={14} aria-hidden="true" />}
                  </div>
                  <span className="whitespace-pre-wrap">{formatText(opt)}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={selectedIndices.length === 0}
                className="px-8 py-2.5 bg-teal-600 text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 active:scale-95 transition shadow-sm"
              >
                {mode === 'exam' ? t.quiz.next : t.quiz.submit}
              </button>
            </div>
          </motion.div>
        ) : (
          /* BACK SIDE (Result & Explanation) */
          <motion.div 
            key="result-view"
            aria-live="polite"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
            className={`w-full flex flex-col border rounded-2xl p-6 sm:p-10 shadow-2xl bg-zinc-900
              ${isCorrect ? 'border-emerald-600/40' : 'border-rose-600/40'}`}
          >
            <div className="flex items-center gap-4 mb-6 border-b border-zinc-800/80 pb-4 shrink-0">
              {isCorrect ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-600/20 shrink-0">
                  <CheckCircle2 size={24} aria-hidden="true" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 ring-1 ring-rose-600/20 shrink-0">
                  <XCircle size={24} aria-hidden="true" />
                </div>
              )}
              <h2 className={`text-xl font-bold tracking-wide ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isCorrect ? t.quiz.correct : t.quiz.incorrect}
              </h2>
            </div>

            <div className="mb-5 shrink-0">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-2">{t.quiz.question}</h3>
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {formatText(content.question)}
              </p>
            </div>

            <div className="bg-zinc-800/40 rounded-xl p-5 mb-5 border border-zinc-700/50 backdrop-blur-sm">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-3">{t.quiz.correctAnswers}</h3>
              <ul className="flex flex-col gap-2">
                {content.answers.map(ansIdx => (
                  <li key={ansIdx} className="text-zinc-200 flex items-start gap-2">
                    <div className="mt-1 text-emerald-500"><CheckCircle2 size={16} aria-hidden="true" /></div>
                    <span className="whitespace-pre-wrap text-zinc-300 font-medium">{formatText(content.options[ansIdx])}</span>
                  </li>
                ))}
              </ul>
            </div>

            {content.explanation && (
              <div className="bg-teal-900/10 rounded-xl p-5 mb-6 border border-teal-600/20 backdrop-blur-sm shadow-inner">
                <h3 className="text-xs text-teal-500 uppercase font-bold tracking-wider mb-3">{t.quiz.explanation}</h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap tracking-wide">
                  {formatText(content.explanation)}
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-zinc-800/80">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-6 py-3 border border-zinc-600 text-zinc-300 font-medium rounded-full flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 active:scale-95 transition w-full sm:w-auto shadow-sm"
                >
                  <Bot size={18} aria-hidden="true" />
                  <span>{t.quiz.askAi}</span>
                </button>

                {mode !== 'review' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="px-8 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 transition shadow-sm w-full sm:w-auto"
                  >
                    {t.quiz.next}
                  </button>
                ) : (
                  onClose && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                      }}
                      className="px-8 py-3 bg-zinc-700 text-white font-medium rounded-full hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 active:scale-95 transition shadow-sm w-full sm:w-auto"
                    >
                      {t.quiz.closeReview}
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
