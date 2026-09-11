import DeckClientLoader from "@/components/cards/DeckClientLoader"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ deckId: string; lang: string }>
  searchParams: Promise<{ limit?: string; mode?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { deckId } = await params
  const formatName = deckId.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  return {
    title: `${formatName} - Memorize Supporter`,
    description: `Study the ${formatName} flashcard deck with active recall.`,
  }
}

export default async function DeckPage({ params, searchParams }: Props) {
  const { deckId, lang } = await params
  const { limit, mode } = await searchParams
  const takeCount = limit && !isNaN(Number(limit)) ? Number(limit) : undefined
  const isExamMode = mode === "exam"

  return (
    <main className="flex-1 flex flex-col items-center bg-background w-full">
      <DeckClientLoader deckId={deckId} limit={takeCount} isExamMode={isExamMode} lang={lang} />
    </main>
  )
}
