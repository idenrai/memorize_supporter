import fs from "fs"
import path from "path"
import prisma from "@/lib/prisma"
import type { Deck } from "@/components/home/DeckGallery"
import type { LearningProgress } from "@prisma/client"

export type ServerDeckCard = {
  id: string
  deck: string
  type: string
  content: string
  createdAt: Date
  progress: LearningProgress | null
}

/**
 * Get available decks with zero-crash resilience.
 * 1. Tries querying the Prisma database.
 * 2. If the database is unreachable, missing, or unmigrated (e.g. Vercel serverless environment),
 *    falls back to reading public sample decks directly from input/public/*.json.
 */
export async function getAvailableDecks(): Promise<Deck[]> {
  try {
    const dbDecks = await prisma.deck.findMany({
      where: {
        isHidden: false
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        series: true,
        createdAt: true,
        _count: {
          select: { cards: true }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    if (dbDecks && dbDecks.length > 0) {
      return dbDecks
    }
  } catch (err) {
    console.warn("[getAvailableDecks] Database query failed, falling back to filesystem decks:", (err as Error)?.message || err)
  }

  // Fallback: Read sample decks from input/public/
  return getFilesystemSampleDecks()
}

/**
 * Reads public sample deck JSON files from input/public/
 */
export function getFilesystemSampleDecks(): Deck[] {
  try {
    const publicDir = path.join(process.cwd(), "input", "public")
    if (!fs.existsSync(publicDir)) {
      return []
    }

    const files = fs.readdirSync(publicDir).filter((f) => f.endsWith(".json"))
    const sampleDecks: Deck[] = []

    for (const file of files) {
      try {
        const filePath = path.join(publicDir, file)
        const fileContent = fs.readFileSync(filePath, "utf-8")
        const json = JSON.parse(fileContent)
        const deckId = file.replace(/\.json$/i, "")
        const cards = Array.isArray(json) ? json : (json.cards || [])

        sampleDecks.push({
          id: deckId,
          title: json.title || deckId,
          description: json.description || null,
          type: json.type || "flashcard",
          series: json.series || null,
          createdAt: new Date(0), // stable static date
          _count: { cards: cards.length }
        })
      } catch (e) {
        console.warn(`[getFilesystemSampleDecks] Failed to parse ${file}:`, e)
      }
    }

    return sampleDecks
  } catch (err) {
    console.warn("[getFilesystemSampleDecks] Failed to read public directory:", err)
    return []
  }
}

/**
 * Fetches cards for a specific server deck with fallback to filesystem JSON.
 */
export async function getServerDeckCards(deckId: string): Promise<ServerDeckCard[]> {
  // If it's a client local deck (BYOD), immediately return empty so DeckClientLoader handles it
  if (deckId.startsWith("local_")) {
    return []
  }

  // 1. Try Prisma query
  try {
    const rawCards = await prisma.card.findMany({
      where: { deck: deckId },
      include: { progress: true }
    })
    if (rawCards && rawCards.length > 0) {
      return rawCards
    }
  } catch (err) {
    console.warn(`[getServerDeckCards] Database query failed for deck ${deckId}:`, (err as Error)?.message || err)
  }

  // 2. Fallback: Read from input/public/${deckId}.json
  try {
    const filePath = path.join(process.cwd(), "input", "public", `${deckId}.json`)
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const json = JSON.parse(fileContent)
      const rawCards = Array.isArray(json) ? json : (json.cards || [])

      return rawCards.map((item: Record<string, unknown>, idx: number) => ({
        id: item.id ? String(item.id) : `${deckId}_card_${idx}`,
        deck: deckId,
        type: (item.type as string) || (json.type as string) || "flashcard",
        content: JSON.stringify(item),
        createdAt: new Date(0),
        progress: null
      }))
    }
  } catch (err) {
    console.warn(`[getServerDeckCards] Filesystem fallback failed for deck ${deckId}:`, err)
  }

  return []
}
