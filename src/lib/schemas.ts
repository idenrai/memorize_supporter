import { z } from "zod"
import { clientConfig } from "./config.client"
import { serverConfig } from "./config.server"

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

export const UpdateDeckDetailsSchema = z.object({
  deckId: z.string().min(1, "Deck ID is required"),
  title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long (maximum 100 characters)"),
  series: z.string().max(50, "Series name is too long (maximum 50 characters)").optional()
})

export const ToggleVisibilitySchema = z.object({
  deckId: z.string().min(1, "Deck ID is required"),
  currentHidden: z.boolean()
})

export const DeleteDeckSchema = z.object({
  deckId: z.string().min(1, "Deck ID is required")
})

export const UploadDeckSchema = z.object({
  jsonData: z.string().max(clientConfig.maxUploadBytes, "Payload too large"),
  fileName: z.string()
})

export const SessionResultItemSchema = z.object({
  cardId: z.string().min(1),
  isCorrect: z.boolean(),
  selectedIndices: z.array(z.number()).optional()
})

export const SaveExamResultSchema = z.object({
  deckId: z.string().min(1, "Deck ID is required"),
  score: z.number().min(0).max(100),
  total: z.number().min(1),
  correct: z.number().min(0),
  sessionResults: z.array(SessionResultItemSchema).max(serverConfig.maxSessionResults, "Too many session results").optional()
}).refine((data) => data.correct <= data.total, {
  message: "Correct answers cannot exceed total questions",
  path: ["correct"]
})

export type ActionState = {
  success: boolean
  error?: string
}
