import { FlashcardContentSchema, PracticeQuizContentSchema, VocabularyContentSchema } from "@/lib/schemas"
import type { CardData } from "@/types/card"

export interface RawDbCard {
  id: string
  deckId?: string
  deck?: string
  type: string
  content: string
}

function logCardParseError(cardId: string, cardType: string, errorDetail?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[CardParser] Invalid ${cardType} data for id "${cardId}":`, errorDetail)
  } else {
    console.warn(`[CardParser] Failed to parse card id "${cardId}" (${cardType})`)
  }
}

/**
 * Parses raw serialized card content from the database into a strictly-typed CardData discriminated union.
 * Returns null if the JSON is malformed or does not adhere to the corresponding Zod schema.
 */
export function parseCardData(card: RawDbCard): CardData | null {
  try {
    const parsed = JSON.parse(card.content)

    if (card.type === 'flashcard' || card.type === 'tip') {
      const result = FlashcardContentSchema.safeParse(parsed)
      if (result.success) {
        return { id: card.id, type: 'flashcard', content: result.data }
      }
      logCardParseError(card.id, 'flashcard', result.error.format())
    } else if (card.type === 'practice_quiz' || card.type === 'multiple_choice') {
      const result = PracticeQuizContentSchema.safeParse(parsed)
      if (result.success) {
        return { id: card.id, type: 'practice_quiz', content: result.data }
      }
      logCardParseError(card.id, 'practice_quiz', result.error.format())
    } else if (card.type === 'vocabulary') {
      const result = VocabularyContentSchema.safeParse(parsed)
      if (result.success) {
        return { id: card.id, type: 'vocabulary', content: result.data }
      }
      logCardParseError(card.id, 'vocabulary', result.error.format())
    }
  } catch (error) {
    logCardParseError(card.id, card.type, error)
  }

  return null
}

/**
 * Parses an array of raw database cards into an array of valid CardData items.
 */
export function parseCardDataList(cards: RawDbCard[]): CardData[] {
  const validCards: CardData[] = []
  for (const card of cards) {
    const parsed = parseCardData(card)
    if (parsed) {
      validCards.push(parsed)
    }
  }
  return validCards
}
