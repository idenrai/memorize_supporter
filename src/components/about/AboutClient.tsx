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
  Cpu,
} from 'lucide-react'
import type { Lang } from '@/i18n/types'
import { useT } from '@/hooks/useT'
import BrandLogo from '@/components/common/BrandLogo'

interface AboutClientProps {
  lang: Lang
}

export default function AboutClient({ lang }: AboutClientProps) {
  const t = useT()
  const [isDemoFlipped, setIsDemoFlipped] = useState(false)

  const techSpecifications = [
    { category: t.about.techSpecArchCat, item: t.about.techSpecArchItem, detail: t.about.techSpecArchDetail },
    { category: t.about.techSpecFwCat, item: t.about.techSpecFwItem, detail: t.about.techSpecFwDetail },
    { category: t.about.techSpecStyleCat, item: t.about.techSpecStyleItem, detail: t.about.techSpecStyleDetail },
    { category: t.about.techSpecCognitiveCat, item: t.about.techSpecCognitiveItem, detail: t.about.techSpecCognitiveDetail },
    { category: t.about.techSpecStateCat, item: t.about.techSpecStateItem, detail: t.about.techSpecStateDetail },
    { category: t.about.techSpecDistCat, item: t.about.techSpecDistItem, detail: t.about.techSpecDistDetail },
  ]

  const featureCards = [
    {
      badge: t.about.feat1Badge,
      title: t.about.feat1Title,
      desc: t.about.feat1Desc,
      icon: Layers,
    },
    {
      badge: t.about.feat2Badge,
      title: t.about.feat2Title,
      desc: t.about.feat2Desc,
      icon: Trophy,
    },
    {
      badge: t.about.feat3Badge,
      title: t.about.feat3Title,
      desc: t.about.feat3Desc,
      icon: RotateCcw,
    },
    {
      badge: t.about.feat4Badge,
      title: t.about.feat4Title,
      desc: t.about.feat4Desc,
      icon: Sparkles,
    },
    {
      badge: t.about.feat5Badge,
      title: t.about.feat5Title,
      desc: t.about.feat5Desc,
      icon: Database,
    },
    {
      badge: t.about.feat6Badge,
      title: t.about.feat6Title,
      desc: t.about.feat6Desc,
      icon: Keyboard,
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-10"
    >
      {/* 1. Hero Section: Precision Canvas with Interactive Demo Flip Card */}
      <section
        aria-labelledby="about-hero-title"
        className="card-precision p-6 sm:p-8 md:p-12"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Storytelling & Hero CTA */}
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-2xs font-semibold tracking-wide text-indigo-400">
              <Sparkles size={13} className="text-indigo-400" aria-hidden="true" />
              <span>{t.about.heroBadge}</span>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <BrandLogo size="lg" animated className="shrink-0 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-xs" />
              <div>
                <h1
                  id="about-hero-title"
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 text-balance"
                >
                  {t.home.title}
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-indigo-400">
                  {t.about.tagline}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300 max-w-2xl font-normal">
              {t.about.intro}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}`}
                className="btn-primary rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs"
              >
                <span>{t.about.startLearning}</span>
                <ArrowRight size={14} className="ml-1.5" aria-hidden="true" />
              </Link>

              <a
                href="https://github.com/idenrai/memorize_supporter"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 fill-current"
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
              className="group/demo relative min-h-68 w-full max-w-sm perspective-1000 cursor-pointer select-none text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
            >
              <motion.div
                className="relative min-h-68 w-full preserve-3d"
                initial={false}
                animate={{ rotateY: isDemoFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
              >
                {/* Front Card */}
                <div className="absolute inset-0 backface-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-zinc-800 px-2.5 py-0.5 text-2xs font-semibold text-indigo-400 border border-zinc-700/60">
                      {t.about.demoBadge}
                    </span>
                    <span className="text-3xs font-mono text-zinc-500 uppercase tracking-wider">
                      {t.about.demoQuestionLabel}
                    </span>
                  </div>

                  <div className="my-auto py-3">
                    <p className="text-sm sm:text-base font-semibold text-center text-zinc-100 leading-snug">
                      &ldquo;{t.about.demoFrontQuestion}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-2xs text-zinc-400 font-medium">
                    <span className="kbd-badge">Space</span>
                    <span>{t.about.demoFrontHint}</span>
                  </div>
                </div>

                {/* Back Card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border border-indigo-500/50 bg-zinc-900/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-indigo-500/15 px-2.5 py-0.5 text-2xs font-semibold text-indigo-300 border border-indigo-500/30">
                      {t.about.demoBackBadge}
                    </span>
                    <span className="text-3xs font-mono text-zinc-500 uppercase tracking-wider">
                      {t.about.demoAnswerLabel}
                    </span>
                  </div>

                  <div className="my-auto py-3 overflow-y-auto">
                    <p className="text-xs sm:text-sm font-normal text-center text-zinc-200 leading-relaxed">
                      {t.about.demoBackAnswer}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-2xs text-indigo-400 font-medium">
                    <RotateCcw size={12} aria-hidden="true" />
                    <span>{t.about.demoBackHint}</span>
                  </div>
                </div>
              </motion.div>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Features Grid */}
      <section aria-labelledby="about-features-title" className="space-y-4">
        <div>
          <h2
            id="about-features-title"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-100"
          >
            {t.about.featuresTitle}
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            {t.home.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feat) => {
            const IconComp = feat.icon
            return (
              <div
                key={feat.badge}
                className="card-precision p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-3xs font-semibold text-zinc-400 border border-zinc-800">
                      {feat.badge}
                    </span>
                    <div className="size-7 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 text-indigo-400">
                      <IconComp size={14} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-100 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. The Two Core Pillars: Cognitive Architecture & Zero-Server Local-First */}
      <section aria-label={t.about.corePhilosophiesTitle} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pillar 1: Cognitive Science */}
        <div className="card-precision p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1 text-2xs font-semibold text-indigo-400 border border-zinc-800">
              <Brain size={13} className="text-indigo-400" aria-hidden="true" />
              <span>{t.about.pillar1Badge}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-2">
              {t.about.cognitiveTitle}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal">
              {t.about.cognitiveDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800">
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar1Tag1}
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar1Tag2}
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar1Tag3}
            </span>
          </div>
        </div>

        {/* Pillar 2: Local-First Privacy */}
        <div className="card-precision p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1 text-2xs font-semibold text-emerald-400 border border-zinc-800">
              <ShieldCheck size={13} className="text-emerald-400" aria-hidden="true" />
              <span>{t.about.pillar2Badge}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-2">
              {t.about.privacyTitle}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal">
              {t.about.privacyDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800">
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar2Tag1}
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar2Tag2}
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-2xs font-mono text-zinc-400 border border-zinc-800">
              {t.about.pillar2Tag3}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Keyboard Shortcuts Studio (Tactile Focus) */}
      <section
        aria-labelledby="about-shortcuts-title"
        className="card-precision p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 flex items-center justify-center">
            <Keyboard size={16} aria-hidden="true" />
          </div>
          <div>
            <h2
              id="about-shortcuts-title"
              className="text-base sm:text-lg font-extrabold text-zinc-100"
            >
              {t.about.shortcutsTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.about.shortcutsSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          {keyboardShortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                {sc.keys.map((k) => (
                  <kbd
                    key={k}
                    className="kbd-badge text-xs px-2 py-0.5"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <p className="text-xs font-semibold text-zinc-200 mb-0.5">
                {sc.title}
              </p>
              <p className="text-3xs text-zinc-400 leading-relaxed font-normal">
                {sc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Technical Specifications Table */}
      <section aria-labelledby="about-tech-heading" className="card-precision p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 flex items-center justify-center">
            <Cpu size={16} aria-hidden="true" />
          </div>
          <div>
            <h2
              id="about-tech-heading"
              className="text-base sm:text-lg font-extrabold text-zinc-100"
            >
              {t.about.techTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.about.techSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {techSpecifications.map((spec) => (
            <div
              key={spec.item}
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                  {spec.category}
                </span>
                <CheckCircle2 size={12} className="text-emerald-400" aria-hidden="true" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                {spec.item}
              </div>
              <div className="text-3xs text-zinc-500 mt-1 font-mono">
                {spec.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Philosophy & Data Sovereignty Disclaimer */}
      <footer className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-center text-xs leading-relaxed text-zinc-500 font-normal">
        <p>{t.about.disclaimer}</p>
      </footer>
    </motion.div>
  )
}
