import { z } from "zod"

export const FlashcardContentSchema = z.object({
  category: z.string().optional(),
  front: z.string(),
  back: z.string()
})

export const PracticeQuizContentSchema = z.object({
  category: z.string().optional(),
  question: z.string(),
  options: z.array(z.string()),
  answers: z.array(z.number()),
  explanation: z.string().optional()
})

export const VocabularyContentSchema = z.object({
  word: z.string(),
  meaning: z.string(),
  example: z.string().optional()
})

// Action Schemas
export const UpdateProgressSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  isCorrect: z.boolean(),
  deckId: z.string().min(1, "Deck ID is required")
})

export type ActionState = {
  success: boolean
  error?: string
}
