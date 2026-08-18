"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"

const SaveExamResultSchema = z.object({
  deckId: z.string().min(1, "Deck ID is required"),
  score: z.number().min(0).max(100),
  total: z.number().min(1),
  correct: z.number().min(0),
}).refine((data) => data.correct <= data.total, {
  message: "Correct answers cannot exceed total questions",
  path: ["correct"]
})

export async function saveExamResult(input: { deckId: string, score: number, total: number, correct: number }) {
  const parsed = SaveExamResultSchema.safeParse(input)
  
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error)
    return { success: false, error: "Invalid input data", details: parsed.error.format() }
  }

  const { deckId, score, total, correct } = parsed.data

  try {
    const result = await prisma.examResult.create({
      data: {
        deckId,
        score,
        total,
        correct,
      }
    })
    return { success: true, id: result.id }
  } catch (error) {
    console.error("Failed to save exam result:", error)
    return { success: false, error: "Failed to save exam result" }
  }
}
