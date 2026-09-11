import { z } from 'zod'

export const CardSchema = z.object({
  id: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  
  // Flashcard specific
  front: z.string().nullable().optional(),
  back: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  
  // Quiz specific
  question: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
  answers: z.array(z.number()).nullable().optional(),
  answer: z.number().nullable().optional(),
  explanation: z.string().nullable().optional(),
  
  // Vocabulary specific
  word: z.string().nullable().optional(),
  meaning: z.string().nullable().optional(),
  example: z.string().nullable().optional(),
})

export const DeckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  type: z.string().default('flashcard'),
  series: z.string().nullable().optional(),
  cards: z.array(CardSchema).min(1, "At least one card is required").max(5000, "Maximum 5,000 cards allowed")
})
