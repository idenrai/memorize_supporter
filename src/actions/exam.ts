"use server"

import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"
import { SaveExamResultSchema } from "@/lib/schemas"

export const saveExamResult = actionClient(SaveExamResultSchema, async ({ deckId, score, total, correct, sessionResults }) => {
  try {
    const result = await prisma.examResult.create({
      data: {
        deckId,
        score,
        total,
        correct,
        details: sessionResults ? {
          create: sessionResults.map(r => ({
            cardId: r.cardId,
            isCorrect: r.isCorrect,
            selectedIndices: r.selectedIndices ? JSON.stringify(r.selectedIndices) : null
          }))
        } : undefined
      }
    })
    return { success: true, data: { id: result.id }, message: "Exam result saved successfully" }
  } catch (error) {
    console.error("Failed to save exam result:", error)
    throw new Error("Failed to save exam result")
  }
})
