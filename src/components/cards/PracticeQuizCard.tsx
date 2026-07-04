"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { PracticeQuizContent } from "@/types/card"
import { CheckCircle2, XCircle, Bot } from "lucide-react"
import { useIsPresent } from "framer-motion"
import { useT } from "@/hooks/useT"
import { formatText } from "@/lib/format"
import { toast } from "sonner"

interface Props {
  content: PracticeQuizContent
  onNext?: (isCorrect: boolean) => void
}

export default function PracticeQuizCard({ content, onNext }: Props) {
  const t = useT()
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

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const optionsText = content.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')
    
    const prompt = `아래 객관식 문제에 대해 깊이 있는 해설과 분석을 부탁합니다.
단순히 정답을 알려주는 것을 넘어, 정답인 이유와 오답들이 왜 오답인지, 그리고 이 문제와 관련된 핵심 개념(아키텍처, 서비스 등)은 무엇인지 상세히 설명해 주세요.

[문제]
${content.question}

[보기]
${optionsText}

[기존 해설 요약]
${content.explanation || '없음'}

위 정보를 바탕으로, 제가 이 개념을 완벽하게 이해할 수 있도록 알기 쉽게 설명해 주세요.`

    try {
      await navigator.clipboard.writeText(prompt)
      toast.success("AI에게 질문할 프롬프트가 복사되었습니다! Gemini나 ChatGPT에 붙여넣어 보세요.")
    } catch (err) {
      toast.error("클립보드 복사에 실패했습니다.")
    }
  }

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
      className="w-full max-w-4xl min-h-[550px] sm:min-h-[700px] perspective-1000 select-none font-sans antialiased focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 rounded-2xl"
    >
      <div className={`relative grid w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FRONT SIDE (Question & Options) */}
        <div className="[grid-area:1/1] w-full h-full backface-hidden flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl transition duration-300 hover:border-zinc-700/80">
          <div className="text-xs font-medium text-zinc-400 mb-4 tracking-widest uppercase flex items-center justify-between">
            <span className="truncate max-w-[180px] sm:max-w-[300px] text-teal-500">{content.category || 'Practice Quiz'}</span>
            <span className="text-zinc-500 shrink-0 ml-2">
              {content.answers.length > 1 ? `Select ${content.answers.length}` : 'Select 1'}
            </span>
          </div>
          
          <h2 className={`${content.question.length > 300 ? 'text-sm sm:text-base' : content.question.length > 150 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-semibold text-zinc-200 mb-8 flex-shrink-0 leading-relaxed whitespace-pre-wrap text-balance tracking-wide`}>
            {formatText(content.question)}
          </h2>

          <div className="flex flex-col gap-3 flex-1">
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

          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={selectedIndices.length === 0}
              className="px-8 py-2.5 bg-teal-600 text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 active:scale-95 transition shadow-sm"
            >
              {t.quiz.submit}
            </button>
          </div>
        </div>

        {/* BACK SIDE (Result & Explanation) */}
        <div className={`[grid-area:1/1] w-full h-full backface-hidden [transform:rotateY(180deg)] flex flex-col border rounded-2xl p-6 sm:p-10 shadow-2xl bg-zinc-900
            ${isCorrect ? 'border-emerald-600/40' : 'border-rose-600/40'}`}>
          
          <div className="flex flex-col items-center justify-center mb-6">
            {isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500 ring-1 ring-emerald-600/20">
                <CheckCircle2 size={32} aria-hidden="true" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500 ring-1 ring-rose-600/20">
                <XCircle size={32} aria-hidden="true" />
              </div>
            )}
            <h2 className={`text-2xl font-bold tracking-wide ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isCorrect ? t.quiz.correct : t.quiz.incorrect}
            </h2>
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
            <div className="bg-teal-900/10 rounded-xl p-5 border border-teal-600/20 flex-1 backdrop-blur-sm shadow-inner">
              <h3 className="text-xs text-teal-500 uppercase font-bold tracking-wider mb-3">{t.quiz.explanation}</h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap tracking-wide">
                {formatText(content.explanation)}
              </p>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-zinc-800/80">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-6 py-3 border border-zinc-600 text-zinc-300 font-medium rounded-full flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 active:scale-95 transition-all w-full sm:w-auto shadow-sm"
              >
                <Bot size={18} aria-hidden="true" />
                <span>AI에게 더 깊이 묻기</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 transition-all shadow-sm w-full sm:w-auto"
              >
                {t.quiz.next}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
