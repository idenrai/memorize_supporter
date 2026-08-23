"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { UpdateProgressSchema } from "@/lib/schemas"
import { actionClient } from "@/lib/safe-action"

import { calculateNextReview } from "@/lib/spaced-repetition"

export const updateProgress = actionClient(UpdateProgressSchema, async ({ cardId, isCorrect }) => {
  const existing = await prisma.learningProgress.findUnique({
    where: { cardId }
  })

  const now = new Date()
  
  const result = calculateNextReview(isCorrect, existing ? {
    reviewCount: existing.reviewCount,
    successRate: existing.successRate
  } : null, now)

  if (!existing) {
    await prisma.learningProgress.create({
      data: {
        cardId,
        reviewCount: result.nextReviewCount,
        lastReviewedAt: now,
        nextReviewAt: result.nextReviewAt,
        successRate: result.nextSuccessRate
      }
    })
  } else {
    await prisma.learningProgress.update({
      where: { cardId },
      data: {
        reviewCount: result.nextReviewCount,
        lastReviewedAt: now,
        nextReviewAt: result.nextReviewAt,
        successRate: result.nextSuccessRate
      }
    })
  }

  // Cache Revalidation
  revalidatePath('/', 'layout')
  
  return { success: true, message: "Progress updated" }
})
