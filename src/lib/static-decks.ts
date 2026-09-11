import fs from "fs"
import path from "path"
import type { Deck } from "@/types/deck"

export type StaticCard = {
  id: string
  deck: string
  type: string
  content: string
  createdAt: Date
  progress: null
}

/**
 * Reads public sample deck JSON files from input/public/ without any database dependency.
 */
export function getStaticDecks(): Deck[] {
  try {
    const publicDir = path.join(process.cwd(), "input", "public")
    if (!fs.existsSync(publicDir)) {
      return []
    }

    const files = fs.readdirSync(publicDir).filter((f) => f.endsWith(".json"))
    const decks: Deck[] = []

    for (const file of files) {
      try {
        const filePath = path.join(publicDir, file)
        const fileContent = fs.readFileSync(filePath, "utf-8")
        const json = JSON.parse(fileContent)
        const deckId = file.replace(/\.json$/i, "")
        const cards = Array.isArray(json) ? json : (json.cards || [])

        decks.push({
          id: deckId,
          title: json.title || json.deckName || deckId,
          description: json.description || null,
          type: json.type || "flashcard",
          series: json.series || null,
          createdAt: new Date(0),
          _count: { cards: cards.length }
        })
      } catch (e) {
        console.warn(`[getStaticDecks] Failed to parse ${file}:`, e)
      }
    }

    // Stable sort by id
    return decks.sort((a, b) => a.id.localeCompare(b.id))
  } catch (err) {
    console.warn("[getStaticDecks] Failed to read public directory:", err)
    return []
  }
}

/**
 * Fetches raw cards for a sample deck directly from input/public/${deckId}.json
 */
export function getStaticDeckCards(deckId: string): StaticCard[] {
  try {
    const filePath = path.join(process.cwd(), "input", "public", `${deckId}.json`)
    if (!fs.existsSync(filePath)) {
      return []
    }

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
  } catch (err) {
    console.warn(`[getStaticDeckCards] Failed to read sample deck ${deckId}:`, err)
    return []
  }
}
