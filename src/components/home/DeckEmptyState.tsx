"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"

interface DeckEmptyStateProps {
  lang: Lang
  isLoadingSamples: boolean
  onTasteSamples: () => void
}

export default function DeckEmptyState({
  lang,
  isLoadingSamples,
  onTasteSamples
}: DeckEmptyStateProps) {
  const t = useT()

  return (
    <div className="w-full">
      <div className="card-precision p-6 sm:p-8 md:p-10 w-full">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center sm:text-left mb-8 border-b border-zinc-800/80 pb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight mb-2 break-keep">
              {t.home.welcomeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl break-keep font-normal">
              {t.home.welcomeDesc}
            </p>
          </div>

          {/* Quick Start 2-Column Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
            {/* Tile 1: Quick Sample Decks */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-colors">
              <div>
                <span className="inline-block text-2xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Quick Start
                </span>
                <h3 className="text-base font-bold text-zinc-100 mb-1.5 tracking-tight">
                  {t.home.quickStartSampleTitle}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed break-keep font-normal mb-5">
                  {t.home.quickStartSampleDesc}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onTasteSamples}
                  disabled={isLoadingSamples}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold btn-primary flex items-center justify-center gap-2"
                >
                  {isLoadingSamples && (
                    <div className="w-3.5 h-3.5 border-2 border-zinc-100 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isLoadingSamples ? t.home.loadingSamples : t.home.trySampleDecks}
                  </span>
                </button>
              </div>
            </div>

            {/* Tile 2: Create Custom Decks */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-colors">
              <div>
                <span className="inline-block text-2xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Custom Deck
                </span>
                <h3 className="text-base font-bold text-zinc-100 mb-1.5 tracking-tight">
                  {t.home.quickStartCustomTitle}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed break-keep font-normal mb-5">
                  {t.home.quickStartCustomDesc}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  href={`/${lang}/data-preparation`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium btn-secondary flex items-center justify-center gap-1.5"
                >
                  <span>{t.home.goToDataPrep}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link
                  href={`/${lang}/data-management`}
                  className="text-2xs sm:text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center py-1"
                >
                  {t.home.alreadyHaveJson}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
