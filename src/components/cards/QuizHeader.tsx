"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"

export interface QuizHeaderProps {
  /** Target URL for back/exit link navigation */
  backHref?: string
  /** Click handler when back action is a button instead of a link */
  onBack?: () => void
  /** Accessibility label and text for the back/exit button */
  backLabel: string

  /** Current question / card index (1-based) */
  current: number
  /** Total number of questions / cards */
  total: number
  /** Optional badge rendered above the progress bar (e.g. retry badge or reviewing index title) */
  badge?: React.ReactNode

  /** Whether to animate progress bar width changes with Framer Motion (default: true) */
  animateProgress?: boolean
  /** Optional animation key to reset/trigger Framer Motion transitions */
  animationKey?: string

  /** Optional right-side controls (e.g. prev/next review arrow buttons) */
  rightControls?: React.ReactNode
}

export default function QuizHeader({
  backHref,
  onBack,
  backLabel,
  current,
  total,
  badge,
  animateProgress = true,
  animationKey,
  rightControls,
}: QuizHeaderProps) {
  const progressPercent = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0

  return (
    <div className="sticky top-[var(--header-height,4rem)] z-30 bg-background/95 backdrop-blur-md py-3 -mt-2 mb-4 sm:mb-6 flex items-center justify-between shrink-0 border-b border-zinc-800/40">
      {/* Left Back / Exit */}
      {backHref ? (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-teal-500 rounded px-2 py-1"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="hidden md:inline text-sm font-medium">{backLabel}</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          title={`${backLabel} (Esc)`}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-teal-500 rounded px-2 py-1"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="text-sm font-medium">{backLabel}</span>
        </button>
      )}

      {/* Center Progress bar & Badge */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8 flex flex-col gap-1">
        {badge}
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          {animateProgress ? (
            <motion.div
              key={animationKey ?? `progress-${current}-${total}`}
              className="h-full bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* Right Controls & Counter */}
      <div className="flex items-center gap-2 shrink-0">
        {rightControls}
        <div className="text-zinc-400 font-medium tabular-nums text-sm sm:text-base">
          {current} <span className="text-zinc-600">/ {total}</span>
        </div>
      </div>
    </div>
  )
}

export function QuizHeaderSkeleton() {
  return (
    <div className="sticky top-[var(--header-height,4rem)] z-30 bg-background/95 backdrop-blur-md py-3 -mt-2 mb-4 sm:mb-6 flex items-center justify-between shrink-0 border-b border-zinc-800/40">
      <div className="flex items-center gap-2 text-zinc-500">
        <ArrowLeft size={20} aria-hidden="true" />
        <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse hidden md:block" />
      </div>
      <div className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden animate-pulse" />
      </div>
      <div className="h-5 w-14 bg-zinc-800 rounded animate-pulse" />
    </div>
  )
}

QuizHeader.Skeleton = QuizHeaderSkeleton
