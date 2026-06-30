import prisma from "@/lib/prisma"
import DeckPlayer from "@/components/cards/DeckPlayer"
import { notFound } from "next/navigation"
import { CardData, FlashcardContent, PracticeQuizContent, VocabularyContent } from "@/types/card"
import { Metadata } from "next"
import { FlashcardContentSchema, PracticeQuizContentSchema, VocabularyContentSchema } from "@/lib/schemas"

type Props = {
  params: Promise<{ deckId: string }>
  searchParams: Promise<{ limit?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { deckId } = await params
  const formatName = deckId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return {
    title: `${formatName} - Memorize Supporter`,
    description: `Study the ${formatName} flashcard deck with active recall.`,
  }
}

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr
}

export default async function DeckPage({ params, searchParams }: Props) {
  const { deckId } = await params
  const { limit } = await searchParams
  const takeCount = limit && !isNaN(Number(limit)) ? Number(limit) : undefined

  const now = new Date()

  // Fetch cards that need review (or haven't been reviewed)
  // SQLite doesn't have a great way to sort by related fields dynamically if null, 
  // so we'll fetch them, prioritize in JS, then limit and shuffle.
  const rawCards = await prisma.card.findMany({
    where: { deck: deckId },
    include: { progress: true }
  })

  if (rawCards.length === 0) {
    notFound()
  }

  // Sort logic: 
  // 1. Cards with nextReviewAt <= now (due for review)
  // 2. Cards with no progress (new cards)
  // 3. Cards with nextReviewAt > now (not due yet)
  const sortedRaw = rawCards.sort((a, b) => {
    const aDue = a.progress?.nextReviewAt ? a.progress.nextReviewAt <= now : true
    const bDue = b.progress?.nextReviewAt ? b.progress.nextReviewAt <= now : true
    
    if (aDue && !bDue) return -1
    if (!aDue && bDue) return 1
    return 0
  })

  // Take requested limit
  const limitedCards = takeCount ? sortedRaw.slice(0, takeCount) : sortedRaw

  // Shuffle the selected cards so they appear in random order
  const shuffledCards = shuffle(limitedCards)



  // Parse JSON content and cast to our discriminated union CardData type safely
  const validCards: CardData[] = []

  for (const c of shuffledCards) {
    try {
      const parsed = JSON.parse(c.content)

      if (c.type === 'flashcard' || c.type === 'tip') {
        const result = FlashcardContentSchema.safeParse(parsed)
        if (result.success) {
          validCards.push({ id: c.id, type: 'flashcard', content: result.data })
        } else {
          console.error(`Invalid flashcard data for id ${c.id}:`, result.error)
        }
      } else if (c.type === 'practice_quiz' || c.type === 'multiple_choice') {
        const result = PracticeQuizContentSchema.safeParse(parsed)
        if (result.success) {
          validCards.push({ id: c.id, type: 'practice_quiz', content: result.data })
        } else {
          console.error(`Invalid practice_quiz data for id ${c.id}:`, result.error)
        }
      } else if (c.type === 'vocabulary') {
        const result = VocabularyContentSchema.safeParse(parsed)
        if (result.success) {
          validCards.push({ id: c.id, type: 'vocabulary', content: result.data })
        } else {
          console.error(`Invalid vocabulary data for id ${c.id}:`, result.error)
        }
      }
    } catch (e) {
      console.error(`Failed to parse JSON for card id ${c.id}:`, e)
    }
  }

  // Fallback if all cards were invalid
  if (validCards.length === 0) {
    validCards.push({ id: 'error', type: 'flashcard', content: { front: 'Error', back: 'All cards in this deck contain invalid data format.' } })
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <DeckPlayer deckId={deckId} cards={validCards} />
    </main>
  )
}
