"use client"

import { useEffect, useState, useCallback } from "react"
import { PracticeQuizContent } from "@/types/card"
import { CheckCircle2, XCircle } from "lucide-react"
import { useIsPresent } from "framer-motion"

interface Props {
  content: PracticeQuizContent
  onNext?: (isCorrect: boolean) => void
}

export default function PracticeQuizCard({ content, onNext }: Props) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  
  const isPresent = useIsPresent()
  
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
    setIsFlipped(true)
  }, [selectedIndices, isFlipped])

  const handleNext = useCallback(() => {
    if (!isFlipped) return
    onNext?.(isCorrect)
  }, [isFlipped, isCorrect, onNext])

  // Keyboard navigation
  useEffect(() => {
    // If component is currently exiting (AnimatePresence), ignore key events
    if (!isPresent) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering shortcuts if typing
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (!isFlipped) {
        // Any key to submit (if something is selected)
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault()
          handleSubmit()
        }
      } else {
        // Any key to advance to next
        if (e.key === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight') {
          e.preventDefault()
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, handleNext, isFlipped, isPresent])

  return (
    <div className="w-full max-w-4xl h-[550px] sm:h-[700px] perspective-1000 select-none">
      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FRONT SIDE (Question & Options) */}
        <div className="absolute w-full h-full backface-hidden flex flex-col bg-[#1c1f26] border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-xl overflow-y-auto hover:bg-[#232730] transition-colors">
          <div className="text-xs font-semibold text-blue-500 mb-4 tracking-wider uppercase flex items-center justify-between">
            <span className="truncate max-w-[180px] sm:max-w-[300px]">{content.category || 'Practice Quiz'}</span>
            <span className="text-gray-500 shrink-0 ml-2">
              {content.answers.length > 1 ? `Select ${content.answers.length}` : 'Select 1'}
            </span>
          </div>
          
          <h2 className={`${content.question.length > 150 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-gray-100 mb-6 flex-shrink-0 leading-relaxed`}>
            {content.question}
          </h2>

          <div className="flex flex-col gap-3 flex-1">
            {content.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => toggleSelection(i)}
                className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm sm:text-base ${
                  selectedIndices.includes(i) 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300' 
                    : 'border-gray-800 hover:border-gray-600 text-gray-300 bg-black/20'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 border ${
                  isSingleChoice ? 'rounded-full' : 'rounded'
                } ${
                  selectedIndices.includes(i) ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-600'
                }`}>
                  {selectedIndices.includes(i) && <CheckCircle2 size={14} />}
                </div>
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={selectedIndices.length === 0}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
            >
              Submit (Enter)
            </button>
          </div>
        </div>

        {/* BACK SIDE (Result & Explanation) */}
        <div className={`absolute w-full h-full backface-hidden [transform:rotateY(180deg)] flex flex-col border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-xl overflow-y-auto bg-[#1c1f26]
            ${isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
          
          <div className="flex flex-col items-center justify-center mb-6">
            {isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                <CheckCircle2 size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
                <XCircle size={32} />
              </div>
            )}
            <h2 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h2>
          </div>

          <div className="bg-black/30 rounded-xl p-4 mb-4 border border-gray-800">
            <h3 className="text-sm text-gray-500 uppercase font-semibold mb-2">Correct Answer(s)</h3>
            <ul className="flex flex-col gap-2">
              {content.answers.map(ansIdx => (
                <li key={ansIdx} className="text-gray-200 flex items-start gap-2">
                  <div className="mt-1 text-green-400"><CheckCircle2 size={16} /></div>
                  <span>{content.options[ansIdx]}</span>
                </li>
              ))}
            </ul>
          </div>

          {content.explanation && (
            <div className="bg-blue-900/10 rounded-xl p-4 border border-blue-900/30 flex-1">
              <h3 className="text-xs sm:text-sm text-blue-500 uppercase font-semibold mb-2">Explanation</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {content.explanation}
              </p>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-gray-800/50">
            <div className="flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-500 transition-colors"
              >
                Next (Enter)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
