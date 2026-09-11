import { NextResponse } from "next/server"
import { getStaticDeckCards } from "@/lib/static-decks"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deckId: string }> }
) {
  const { deckId } = await params
  const cards = getStaticDeckCards(deckId)
  if (!cards || cards.length === 0) {
    return NextResponse.json({ error: "Sample deck not found" }, { status: 404 })
  }
  return NextResponse.json({ cards })
}
