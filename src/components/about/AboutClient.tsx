'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  Keyboard,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import type { Lang } from '@/i18n/types'
import { useT } from '@/hooks/useT'
import BrandLogo from '@/components/common/BrandLogo'

interface AboutClientProps {
  lang: Lang
}

const TECH_STACK = [
  'React 19 + TypeScript',
  'Next.js 16 (App Router)',
  'Tailwind CSS v4',
  'IndexedDB Native (Zero-Server)',
  'Zustand 5',
  'Framer Motion 12',
  'Zod Schema Validation',
  'Lucide React & Sonner',
  'PWA (Service Worker)',
  'Ebbinghaus SRS Model',
]

export default function AboutClient({ lang }: AboutClientProps) {
  const t = useT()
  const [isDemoFlipped, setIsDemoFlipped] = useState(false)

  const featureCards = [
    {
      badge: t.about.feat1Badge,
      title: t.about.feat1Title,
      desc: t.about.feat1Desc,
      icon: Layers,
      color: 'text-teal-400',
      bgGlow: 'bg-teal-500/20',
      borderGlow: 'hover:border-teal-500/40',
    },
    {
      badge: t.about.feat2Badge,
      title: t.about.feat2Title,
      desc: t.about.feat2Desc,
      icon: Trophy,
      color: 'text-purple-400',
      bgGlow: 'bg-purple-500/20',
      borderGlow: 'hover:border-purple-500/40',
    },
    {
      badge: t.about.feat3Badge,
      title: t.about.feat3Title,
      desc: t.about.feat3Desc,
      icon: RotateCcw,
      color: 'text-rose-400',
      bgGlow: 'bg-rose-500/20',
      borderGlow: 'hover:border-rose-500/40',
    },
    {
      badge: t.about.feat4Badge,
      title: t.about.feat4Title,
      desc: t.about.feat4Desc,
      icon: Sparkles,
      color: 'text-blue-400',
      bgGlow: 'bg-blue-500/20',
      borderGlow: 'hover:border-blue-500/40',
    },
    {
      badge: t.about.feat5Badge,
      title: t.about.feat5Title,
      desc: t.about.feat5Desc,
      icon: Database,
      color: 'text-indigo-400',
      bgGlow: 'bg-indigo-500/20',
      borderGlow: 'hover:border-indigo-500/40',
    },
    {
      badge: t.about.feat6Badge,
      title: t.about.feat6Title,
      desc: t.about.feat6Desc,
      icon: Keyboard,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/20',
      borderGlow: 'hover:border-emerald-500/40',
    },
  ]

  const keyboardShortcuts = [
    {
      keys: ['Space', 'Enter'],
      title: t.about.shortcutFlipTitle,
      desc: t.about.shortcutFlipDesc,
    },
    {
      keys: ['1', '2', '3', '4'],
      title: t.about.shortcutChoiceTitle,
      desc: t.about.shortcutChoiceDesc,
    },
    {
      keys: ['←', '→'],
      title: t.about.shortcutFeedbackTitle,
      desc: t.about.shortcutFeedbackDesc,
    },
    {
      keys: ['Esc'],
      title: t.about.shortcutEscTitle,
      desc: t.about.shortcutEscDesc,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8 md:space-y-12"
    >
      {/* 1. Hero Section with Brand & Interactive Demo Flip Card */}
      <section
        aria-labelledby="about-hero-title"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-8 md:p-12 shadow-2xl backdrop-blur-xl"
      >
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-linear-to-br from-indigo-500/20 via-teal-500/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-linear-to-tl from-teal-500/20 via-indigo-500/15 to-transparent blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Storytelling & Hero CTA */}
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-300">
              <Sparkles size={14} className="text-teal-400" aria-hidden="true" />
              <span>{t.about.heroBadge}</span>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <BrandLogo size="lg" animated className="shrink-0 rounded-2xl border border-white/10 bg-zinc-900 p-1.5 shadow-md" />
              <div>
                <h1
                  id="about-hero-title"
                  className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-100 via-white to-zinc-300 sm:text-3xl md:text-4xl text-balance"
                >
                  {t.home.title}
                </h1>
                <p className="mt-1 text-sm sm:text-base font-medium text-teal-400/90">
                  {t.about.tagline}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300 max-w-2xl font-normal">
              {t.about.intro}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}`}
                className="btn-indigo rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg shadow-indigo-950/50 transition-[transform,background-color,box-shadow] hover:scale-102 active:scale-98"
              >
                <span>{t.about.startLearning}</span>
                <ArrowRight size={16} className="ml-1.5" aria-hidden="true" />
              </Link>

              <a
                href="https://github.com/idenrai/memorize_supporter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span>{t.about.githubLink}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Tactile Interactive 3D Demo Flashcard */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <button
              type="button"
              aria-label={isDemoFlipped ? t.about.demoBackHint : t.about.demoFrontHint}
              onClick={() => setIsDemoFlipped(!isDemoFlipped)}
              className="group/demo relative min-h-72 w-full max-w-sm perspective-1000 cursor-pointer select-none text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500/50 rounded-3xl"
            >
              <motion.div
                className="relative min-h-72 w-full preserve-3d"
                initial={false}
                animate={{ rotateY: isDemoFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 180, damping: 20 }}
              >
                {/* Front Card */}
                <div className="absolute inset-0 backface-hidden rounded-3xl border border-teal-500/30 bg-zinc-900/90 p-5 sm:p-7 shadow-2xl flex flex-col justify-between hover-glow-indigo">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-teal-500/15 px-3 py-1 text-2xs font-bold uppercase tracking-widest text-teal-400 border border-teal-500/30">
                      {t.about.demoBadge}
                    </span>
                    <span className="text-2xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t.about.demoQuestionLabel}
                    </span>
                  </div>

                  <div className="my-auto py-3">
                    <p className="text-base sm:text-lg font-semibold text-center text-zinc-100 leading-snug">
                      &ldquo;{t.about.demoFrontQuestion}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400/90 font-medium animate-pulse motion-reduce:animate-none">
                    <Sparkles size={14} aria-hidden="true" />
                    <span>{t.about.demoFrontHint}</span>
                  </div>
                </div>

                {/* Back Card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border border-indigo-500/40 bg-zinc-900/95 p-5 sm:p-7 shadow-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-2xs font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
                      {t.about.demoBackBadge}
                    </span>
                    <span className="text-2xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t.about.demoAnswerLabel}
                    </span>
                  </div>

                  <div className="my-auto py-3 overflow-y-auto">
                    <p className="text-xs sm:text-sm font-normal text-center text-zinc-200 leading-relaxed">
                      {t.about.demoBackAnswer}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-400/90 font-medium">
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>{t.about.demoBackHint}</span>
                  </div>
                </div>
              </motion.div>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Features: The 6 Tactile Deck Cards */}
      <section aria-labelledby="about-features-title" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="about-features-title"
              className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400"
            >
              {t.about.featuresTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              {t.home.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feat) => {
            const IconComp = feat.icon
            return (
              <div
                key={feat.badge}
                className="group relative flex flex-col rounded-3xl p-px overflow-hidden hover-glow-indigo"
              >
                {/* Outer gradient border background */}
                <div className="absolute inset-0 bg-linear-to-br from-zinc-800 via-zinc-900 to-black opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/30 via-teal-500/20 to-purple-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-md" />

                {/* Inner Card Container */}
                <div className="relative h-full flex flex-col justify-between bg-zinc-950/90 backdrop-blur-xl rounded-[23px] p-6 border border-white/5">
                  {/* Subtle Ambient Glow Bubble */}
                  <div className="absolute inset-0 overflow-hidden rounded-[23px] pointer-events-none z-0">
                    <div className={`absolute -top-10 -right-10 size-32 rounded-full blur-3xl opacity-15 group-hover:opacity-40 transition-opacity duration-500 ${feat.bgGlow}`} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-2xs font-bold uppercase tracking-widest text-zinc-400 border border-white/10 shadow-inner">
                        {feat.badge}
                      </span>
                      <div className={`size-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner group-hover:scale-105 transition-transform ${feat.color}`}>
                        <IconComp size={20} aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. The Two Core Pillars: Cognitive Architecture & Zero-Server Local-First */}
      <section aria-label={t.about.corePhilosophiesTitle} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pillar 1: Cognitive Science */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-teal-500/20 bg-zinc-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-colors hover:border-teal-500/40">
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-teal-500/15 blur-3xl group-hover:bg-teal-500/25 transition-colors" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3.5 py-1 text-2xs font-bold uppercase tracking-widest text-teal-400 border border-teal-500/30">
                <Brain size={14} className="text-teal-400" aria-hidden="true" />
                <span>{t.about.pillar1Badge}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">
                {t.about.cognitiveTitle}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal">
                {t.about.cognitiveDesc}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-2xs font-medium text-teal-300 border border-teal-500/20">
                {t.about.pillar1Tag1}
              </span>
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-2xs font-medium text-teal-300 border border-teal-500/20">
                {t.about.pillar1Tag2}
              </span>
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-2xs font-medium text-teal-300 border border-teal-500/20">
                {t.about.pillar1Tag3}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Local-First Privacy */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-emerald-500/20 bg-zinc-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-colors hover:border-emerald-500/40">
          <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-emerald-500/15 blur-3xl group-hover:bg-emerald-500/25 transition-colors" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-2xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={14} className="text-emerald-400" aria-hidden="true" />
                <span>{t.about.pillar2Badge}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">
                {t.about.privacyTitle}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal">
                {t.about.privacyDesc}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-2xs font-medium text-emerald-300 border border-emerald-500/20">
                {t.about.pillar2Tag1}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-2xs font-medium text-emerald-300 border border-emerald-500/20">
                {t.about.pillar2Tag2}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-2xs font-medium text-emerald-300 border border-emerald-500/20">
                {t.about.pillar2Tag3}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Keyboard Shortcuts Studio (Tactile Focus) */}
      <section
        aria-labelledby="about-shortcuts-title"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-5 sm:p-8 backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="size-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Keyboard size={18} aria-hidden="true" />
          </div>
          <div>
            <h2
              id="about-shortcuts-title"
              className="text-lg sm:text-xl font-extrabold text-zinc-100"
            >
              {t.about.shortcutsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {t.about.shortcutsSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {keyboardShortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 transition-colors hover:border-white/15"
            >
              <div className="flex items-center gap-1.5 mb-3">
                {sc.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-block rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-xs font-bold text-zinc-200 shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 mb-1">
                {sc.title}
              </p>
              <p className="text-2xs sm:text-xs text-zinc-400 leading-relaxed">
                {sc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tech Stack: Pill Badges */}
      <section aria-labelledby="about-tech-heading" className="space-y-3">
        <h2
          id="about-tech-heading"
          className="text-base font-bold text-zinc-300"
        >
          {t.about.techTitle}
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {TECH_STACK.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-sm transition-[color,background-color,border-color] hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
            >
              <CheckCircle2 size={12} className="text-indigo-400 shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 6. Philosophy & Data Sovereignty Disclaimer */}
      <footer className="rounded-2xl border border-white/5 bg-zinc-950/40 p-5 text-center text-xs leading-relaxed text-zinc-500">
        <p>{t.about.disclaimer}</p>
      </footer>
    </motion.div>
  )
}
