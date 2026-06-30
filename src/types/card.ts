import { z } from "zod"
import { FlashcardContentSchema, PracticeQuizContentSchema, VocabularyContentSchema } from "@/lib/schemas"

export type FlashcardContent = z.infer<typeof FlashcardContentSchema>
export type PracticeQuizContent = z.infer<typeof PracticeQuizContentSchema>
export type VocabularyContent = z.infer<typeof VocabularyContentSchema>

export type CardData = 
  | { id: string; type: 'flashcard'; content: FlashcardContent }
  | { id: string; type: 'practice_quiz'; content: PracticeQuizContent }
  | { id: string; type: 'vocabulary'; content: VocabularyContent }
