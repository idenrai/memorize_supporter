import { z } from "zod"

export const FlashcardContentSchema = z.object({
  category: z.string().optional(),
  front: z.string(),
  back: z.string()
})

export const MultipleChoiceQuizContentSchema = z.object({
  category: z.string().optional(),
  question: z.string(),
  options: z.array(z.string()),
  answers: z.array(z.number()),
  explanation: z.string().optional()
})

/**
 * Backward compatibility alias for legacy code and imports.
 * @deprecated Use `MultipleChoiceQuizContentSchema` instead.
 */
export { MultipleChoiceQuizContentSchema as PracticeQuizContentSchema }

export const VocabularyContentSchema = z.object({
  word: z.string(),
  meaning: z.string(),
  example: z.string().optional()
})
