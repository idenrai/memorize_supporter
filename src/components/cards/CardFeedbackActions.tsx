"use client"

import { motion } from "framer-motion"
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react"
import { useT } from "@/hooks/useT"

interface CardFeedbackActionsProps {
  onFeedback: (type: "correct" | "incorrect") => void
  disabled?: boolean
}

export default function CardFeedbackActions({
  onFeedback,
  disabled = false,
}: CardFeedbackActionsProps) {
  const t = useT()

  return (
    <div className="flex items-center justify-center gap-3 pt-4 border-t border-zinc-800 select-none">
      <span
        className="text-zinc-400 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <ArrowLeft size={22} strokeWidth={2.5} />
      </span>

      <motion.button
        type="button"
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onFeedback("incorrect")
        }}
        aria-label={t.quiz.incorrect}
        title={`${t.quiz.incorrect} (←)`}
        className="flex items-center justify-center w-16 sm:w-20 h-11 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/25 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-40 disabled:pointer-events-none"
      >
        <X size={20} aria-hidden="true" />
      </motion.button>

      <motion.button
        type="button"
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onFeedback("correct")
        }}
        aria-label={t.quiz.correct}
        title={`${t.quiz.correct} (→)`}
        className="flex items-center justify-center w-16 sm:w-20 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-40 disabled:pointer-events-none"
      >
        <Check size={20} aria-hidden="true" />
      </motion.button>

      <span
        className="text-zinc-400 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <ArrowRight size={22} strokeWidth={2.5} />
      </span>
    </div>
  )
}
