import { z } from 'zod'

export const CardSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  
  // Flashcard specific
  front: z.string().optional(),
  back: z.string().optional(),
  category: z.string().optional(),
  
  // Quiz specific
  question: z.string().optional(),
  options: z.array(z.string()).optional(),
  answers: z.array(z.number()).optional(),
  answer: z.number().optional(),
  explanation: z.string().optional(),
  
  // Vocabulary specific
  word: z.string().optional(),
  meaning: z.string().optional(),
  example: z.string().optional(),
})

export const DeckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().default('flashcard'),
  series: z.string().optional(),
  cards: z.array(CardSchema).min(1, "At least one card is required").max(5000, "Maximum 5,000 cards allowed")
})
