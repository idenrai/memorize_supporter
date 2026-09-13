import { z } from "zod"
import { FlashcardContentSchema, MultipleChoiceQuizContentSchema, VocabularyContentSchema } from "../schemas/index.ts"

export type FlashcardContent = z.infer<typeof FlashcardContentSchema>
export type MultipleChoiceQuizContent = z.infer<typeof MultipleChoiceQuizContentSchema>
/**
 * Backward compatibility alias for legacy code and imports.
 * @deprecated Use `MultipleChoiceQuizContent` instead.
 */
export type PracticeQuizContent = MultipleChoiceQuizContent
export type VocabularyContent = z.infer<typeof VocabularyContentSchema>

export const QUIZ_TYPES = ['multiple_choice_quiz', 'practice_quiz'] as const
export type QuizType = typeof QUIZ_TYPES[number]

export function isQuizType(type?: string | null): type is QuizType {
  if (!type) return false
  return (QUIZ_TYPES as readonly string[]).includes(type.toLowerCase())
}

export type QuizCardData = { id: string; type: QuizType; content: MultipleChoiceQuizContent }

export type CardData = 
  | { id: string; type: 'flashcard'; content: FlashcardContent }
  | QuizCardData
  | { id: string; type: 'vocabulary'; content: VocabularyContent }

export function isQuizCard(card?: CardData | null): card is QuizCardData {
  if (!card) return false
  return isQuizType(card.type)
}

