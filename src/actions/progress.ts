"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { UpdateProgressSchema } from "@/lib/schemas"
import { actionClient } from "@/lib/safe-action"

export const updateProgress = actionClient(UpdateProgressSchema, async ({ cardId, isCorrect, deckId }) => {
  const existing = await prisma.learningProgress.findUnique({
    where: { cardId }
  })

  const now = new Date()

  if (!existing) {
    // First time review
    const nextReviewAt = new Date(now)
    if (isCorrect) {
      nextReviewAt.setDate(now.getDate() + 1) // Review tomorrow if easy
    } else {
      nextReviewAt.setMinutes(now.getMinutes() + 10) // Review shortly if hard
    }

    await prisma.learningProgress.create({
      data: {
        cardId,
        reviewCount: 1,
        lastReviewedAt: now,
        nextReviewAt: nextReviewAt,
        successRate: isCorrect ? 1.0 : 0.0
      }
    })
  } else {
    // Subsequent review
    const newCount = existing.reviewCount + 1
    const newSuccessCount = (existing.successRate || 0) * existing.reviewCount + (isCorrect ? 1 : 0)
    const newSuccessRate = newSuccessCount / newCount

    const nextReviewAt = new Date(now)
    
    // Naive Spaced Repetition calculation
    if (isCorrect) {
      const intervalDays = Math.pow(2, existing.reviewCount)
      nextReviewAt.setDate(now.getDate() + intervalDays)
    } else {
      nextReviewAt.setMinutes(now.getMinutes() + 10)
    }

    await prisma.learningProgress.update({
      where: { cardId },
      data: {
        reviewCount: newCount,
        lastReviewedAt: now,
        nextReviewAt,
        successRate: newSuccessRate
      }
    })
  }

  // Cache Revalidation
  revalidatePath('/', 'layout')
  
  return { success: true, message: "Progress updated" }
})
