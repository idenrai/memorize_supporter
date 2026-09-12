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
