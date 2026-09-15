import { type RawDbCard, parseCardDataList } from "./card-parser.ts"
import { type CardData, isQuizType } from "../types/card.ts"
import type { LocalProgress } from "./db/progress.ts"

/**
 * Fisher-Yates array shuffle algorithm (immutably returns a new shuffled array)
 * Supports an optional custom random number generator for dependency injection and deterministic testing.
 */
export function shuffle<T>(array: readonly T[], rng: () => number = Math.random): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export interface SelectSessionCardsOptions {
  cards: RawDbCard[]
  progressMap?: Record<string, LocalProgress>
  limit?: number
  isExamMode?: boolean
  rng?: () => number
}

/**
 * Selects and prepares cards for a study or exam session.
 * 
 * - Exam Mode:
 *   Prioritizes quiz-capable cards and performs uniform random sampling without replacement.
 *   Ensures that every session with a limit (e.g. 20 cards out of 61) draws a randomized
 *   subset rather than deterministically slicing the first N cards.
 * 
 * - Practice Mode:
 *   Applies Spaced Repetition (SRS) prioritization (Category 1: Unstudied, Category 2: Failed/In-progress,
 *   Category 3: Mastered). Pre-shuffles within same priority tiers to avoid card starvation,
 *   selects up to `limit` cards, and shuffles the final selection for active recall.
 */
export function selectSessionCards({
  cards,
  progressMap = {},
  limit,
  isExamMode = false,
  rng = Math.random,
}: SelectSessionCardsOptions): CardData[] {
  if (!cards || cards.length === 0) {
    return []
  }

  // 1. Exam Mode: Random Sampling without Replacement
  if (isExamMode) {
    const quizCards = cards.filter((card) => isQuizType(card.type))
    const eligiblePool = quizCards.length > 0 ? quizCards : cards

    const shuffledPool = shuffle(eligiblePool, rng)
    const selectedRaw = limit && limit > 0 ? shuffledPool.slice(0, limit) : shuffledPool

    return parseCardDataList(selectedRaw)
  }

  // 2. Practice Mode: SRS Prioritization with Tier Randomization
  // Pre-shuffle to avoid index-based starvation among cards with identical priority
  const randomizedInput = shuffle(cards, rng)

  const mapped = randomizedInput.map((card) => {
    let category = 3
    let failedCount = 0
    const p = progressMap[card.id]

    if (!p || p.reviewCount === 0) {
      category = 1
    } else if (p.successRate !== null && p.successRate < 1) {
      category = 2
      const rate = p.successRate || 0
      failedCount = Math.round(p.reviewCount * (1 - rate))
    }

    const dateValue = p?.nextReviewAt ? p.nextReviewAt.getTime() : Infinity
    const reviewCount = p?.reviewCount || 0

    return { card, category, failedCount, reviewCount, dateValue }
  })

  mapped.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category - b.category
    }
    if (a.category === 2) {
      if (a.failedCount !== b.failedCount) {
        return b.failedCount - a.failedCount
      }
    } else if (a.category === 3) {
      if (a.reviewCount !== b.reviewCount) {
        return a.reviewCount - b.reviewCount
      }
    }
    return a.dateValue - b.dateValue
  })

  const sortedCards = mapped.map((item) => item.card)
  const limitedCards = limit && limit > 0 ? sortedCards.slice(0, limit) : sortedCards
  const finalShuffled = shuffle(limitedCards, rng)

  return parseCardDataList(finalShuffled)
}
