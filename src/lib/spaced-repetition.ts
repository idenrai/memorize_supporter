import { serverConfig } from "./config.server"

export interface ReviewState {
  reviewCount: number
  successRate: number | null
}

export interface ReviewResult {
  nextReviewCount: number
  nextSuccessRate: number
  nextReviewAt: Date
}

/**
 * Calculates the next review state based on current state and user's answer.
 * Extracted from progress.ts to separate pure business logic from side effects.
 */
export function calculateNextReview(
  isCorrect: boolean,
  currentState: ReviewState | null,
  now: Date = new Date()
): ReviewResult {
  const nextReviewAt = new Date(now)
  const failedInterval = serverConfig.failedReviewIntervalMinutes
  
  if (!currentState) {
    // First time review
    if (isCorrect) {
      nextReviewAt.setDate(now.getDate() + 1) // Review tomorrow if easy
    } else {
      nextReviewAt.setMinutes(now.getMinutes() + failedInterval) // Review shortly if hard
    }
    
    return {
      nextReviewCount: 1,
      nextSuccessRate: isCorrect ? 1.0 : 0.0,
      nextReviewAt
    }
  }

  // Subsequent review
  const newCount = currentState.reviewCount + 1
  const currentSuccessRate = currentState.successRate || 0
  const newSuccessCount = (currentSuccessRate * currentState.reviewCount) + (isCorrect ? 1 : 0)
  const newSuccessRate = newSuccessCount / newCount

  // Naive Spaced Repetition calculation
  if (isCorrect) {
    const intervalDays = Math.pow(2, currentState.reviewCount)
    nextReviewAt.setDate(now.getDate() + intervalDays)
  } else {
    nextReviewAt.setMinutes(now.getMinutes() + failedInterval)
  }

  return {
    nextReviewCount: newCount,
    nextSuccessRate: newSuccessRate,
    nextReviewAt
  }
}
