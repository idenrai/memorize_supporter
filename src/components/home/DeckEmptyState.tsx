"use client"

import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  FileText,
  Brain,
  FolderKanban,
  Library
} from "lucide-react"
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
    <div className="w-full flex flex-col items-center">
      <div className="relative text-center p-8 sm:p-12 w-full card-precision overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* App Badge */}
          <div className="w-14 h-14 bg-zinc-800 border border-zinc-700/80 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
            <Library size={26} aria-hidden="true" />
          </div>

          {/* Title & Desc */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight break-keep">
            {t.home.welcomeTitle}
          </h3>
          <p className="text-sm text-zinc-400 mb-8 max-w-xl leading-relaxed break-keep font-normal">
            {t.home.welcomeDesc}
          </p>

          {/* 3-Step Visual Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full mb-8 text-left">
            {/* Step 1 */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 transition-colors">
              <div className="text-2xs font-mono font-bold text-zinc-500 mb-1.5">01</div>
              <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm mb-1">
                <FileText size={15} className="text-indigo-400 shrink-0" aria-hidden="true" />
                <span>{t.home.step1Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed break-keep font-normal">
                {t.home.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 transition-colors">
              <div className="text-2xs font-mono font-bold text-zinc-500 mb-1.5">02</div>
              <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm mb-1">
                <Sparkles size={15} className="text-indigo-400 shrink-0" aria-hidden="true" />
                <span>{t.home.step2Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed break-keep font-normal">
                {t.home.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 transition-colors">
              <div className="text-2xs font-mono font-bold text-zinc-500 mb-1.5">03</div>
              <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm mb-1">
                <Brain size={15} className="text-indigo-400 shrink-0" aria-hidden="true" />
                <span>{t.home.step3Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed break-keep font-normal">
                {t.home.step3Desc}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href={`/${lang}/data-preparation`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold btn-primary gap-2"
            >
              <span>{t.home.goToDataPrep}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={onTasteSamples}
              disabled={isLoadingSamples}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium btn-secondary gap-2"
            >
              <Sparkles size={14} className="text-indigo-400" aria-hidden="true" />
              <span>
                {isLoadingSamples ? t.home.loadingSamples : t.home.trySampleDecks}
              </span>
            </button>
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6">
            <Link
              href={`/${lang}/data-management`}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <FolderKanban size={13} aria-hidden="true" />
              <span>{t.home.alreadyHaveJson}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
