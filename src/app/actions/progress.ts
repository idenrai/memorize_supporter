"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { UpdateProgressSchema, ActionState } from "@/lib/schemas"

export async function updateProgress(cardId: string, isCorrect: boolean, deckId: string): Promise<ActionState> {
  try {
    // 1. Validate inputs via Zod
    const validated = UpdateProgressSchema.safeParse({ cardId, isCorrect, deckId })
    if (!validated.success) {
      console.error("Validation error:", validated.error.flatten())
      return { success: false, error: "Invalid parameters provided" }
    }

    const { cardId: validCardId, isCorrect: validIsCorrect, deckId: validDeckId } = validated.data

    // 2. Business Logic
    const existing = await prisma.learningProgress.findUnique({
      where: { cardId: validCardId }
    })

    const now = new Date()

    if (!existing) {
      // First time review
      const nextReviewAt = new Date(now)
      if (validIsCorrect) {
        nextReviewAt.setDate(now.getDate() + 1) // Review tomorrow if easy
      } else {
        nextReviewAt.setMinutes(now.getMinutes() + 10) // Review shortly if hard
      }

      await prisma.learningProgress.create({
        data: {
          cardId: validCardId,
          reviewCount: 1,
          lastReviewedAt: now,
          nextReviewAt: nextReviewAt,
          successRate: validIsCorrect ? 1.0 : 0.0
        }
      })
    } else {
      // Subsequent review
      const newCount = existing.reviewCount + 1
      const newSuccessCount = (existing.successRate || 0) * existing.reviewCount + (validIsCorrect ? 1 : 0)
      const newSuccessRate = newSuccessCount / newCount

      const nextReviewAt = new Date(now)
      
      // Naive Spaced Repetition calculation
      if (validIsCorrect) {
        const intervalDays = Math.pow(2, existing.reviewCount)
        nextReviewAt.setDate(now.getDate() + intervalDays)
      } else {
        nextReviewAt.setMinutes(now.getMinutes() + 10)
      }

      await prisma.learningProgress.update({
        where: { cardId: validCardId },
        data: {
          reviewCount: newCount,
          lastReviewedAt: now,
          nextReviewAt,
          successRate: newSuccessRate
        }
      })
    }

    // 3. Cache Revalidation
    revalidatePath(`/deck/${validDeckId}`)
    revalidatePath('/') // also update the home page stats if any
    
    return { success: true }
  } catch (error) {
    console.error("Error updating progress:", error)
    return { success: false, error: "Failed to update learning progress" }
  }
}
