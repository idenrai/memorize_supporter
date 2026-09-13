import { z } from "zod"
import { FlashcardContentSchema, PracticeQuizContentSchema, VocabularyContentSchema } from "../schemas/index.ts"

export type FlashcardContent = z.infer<typeof FlashcardContentSchema>
export type PracticeQuizContent = z.infer<typeof PracticeQuizContentSchema>
export type VocabularyContent = z.infer<typeof VocabularyContentSchema>

export const QUIZ_TYPES = ['multiple_choice_quiz', 'practice_quiz'] as const
export type QuizType = typeof QUIZ_TYPES[number]

export function isQuizType(type?: string | null): boolean {
  if (!type) return false
  return (QUIZ_TYPES as readonly string[]).includes(type.toLowerCase())
}

export type CardData = 
  | { id: string; type: 'flashcard'; content: FlashcardContent }
  | { id: string; type: 'practice_quiz' | 'multiple_choice_quiz'; content: PracticeQuizContent }
  | { id: string; type: 'vocabulary'; content: VocabularyContent }

