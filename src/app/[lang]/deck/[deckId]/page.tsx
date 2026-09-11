import DeckPlayer from "@/components/cards/DeckPlayer"
import DeckClientLoader from "@/components/cards/DeckClientLoader"
import type { CardData } from "@/types/card"
import type { Metadata } from "next"
import { parseCardDataList } from "@/lib/card-parser"
import { getServerDeckCards } from "@/lib/server-decks"

type Props = {
  params: Promise<{ deckId: string; lang: string }>
  searchParams: Promise<{ limit?: string, mode?: string }>
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
  const { deckId, lang } = await params
  const { limit, mode } = await searchParams
  const takeCount = limit && !isNaN(Number(limit)) ? Number(limit) : undefined
  const isExamMode = mode === 'exam'

  // Fetch cards from DB or fallback to static public JSON files (zero crash in serverless)
  const rawCards = await getServerDeckCards(deckId)

  if (rawCards.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center bg-background w-full">
        <DeckClientLoader deckId={deckId} limit={takeCount} isExamMode={isExamMode} lang={lang} />
      </main>
    )
  }

  // Sort logic: 
  // Priority 1: Unasked cards (!progress or reviewCount === 0)
  // Priority 2: Incorrect cards (successRate < 1), sorted by highest failed count
  // Priority 3: General cards (successRate === 1 or unhandled), sorted by fewer reviewCounts then nextReviewAt
  
  const mappedRaw = rawCards.map(card => {
    let category = 3;
    let failedCount = 0;
    const p = card.progress;
    
    if (!p || p.reviewCount === 0) {
      category = 1;
    } else if (p.successRate !== null && p.successRate < 1) {
      category = 2;
      const rate = p.successRate || 0;
      failedCount = Math.round(p.reviewCount * (1 - rate));
    }

    // null인 nextReviewAt은 당장 풀 문제가 아니라면 맨 뒤로 미룸 (Infinity)
    const dateValue = p?.nextReviewAt?.getTime() || Infinity;
    const reviewCount = p?.reviewCount || 0;

    return { card, category, failedCount, reviewCount, dateValue };
  });

  mappedRaw.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category - b.category;
    }
    
    if (a.category === 2) {
      if (a.failedCount !== b.failedCount) {
        return b.failedCount - a.failedCount; // Descending
      }
    } else if (a.category === 3) {
      if (a.reviewCount !== b.reviewCount) {
        return a.reviewCount - b.reviewCount; // Ascending
      }
    }

    return a.dateValue - b.dateValue;
  });

  const sortedRaw = mappedRaw.map(item => item.card);

  // Take requested limit
  const limitedCards = takeCount ? sortedRaw.slice(0, takeCount) : sortedRaw

  // Shuffle the selected cards so they appear in random order
  const shuffledCards = shuffle(limitedCards)



  // Parse JSON content and validate against Zod schemas into strictly-typed CardData
  const validCards: CardData[] = parseCardDataList(shuffledCards)

  // Fallback if all cards were invalid
  if (validCards.length === 0) {
    validCards.push({ id: 'error', type: 'flashcard', content: { front: 'Error', back: 'All cards in this deck contain invalid data format.' } })
  }

  return (
    <main className="flex-1 flex flex-col items-center bg-background w-full">
      <DeckPlayer deckId={deckId} cards={validCards} mode={isExamMode ? 'exam' : 'practice'} />
    </main>
  )
}
