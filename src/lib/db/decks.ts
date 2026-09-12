import { openDB, notifyLocalDbChange, generateSimpleId } from "./core"
import { DeckSchema } from "@/schemas"
import type { RawDbCard } from "../card-parser"
import { z } from "zod"

export type { RawDbCard }

export interface LocalDeck {
  id: string
  title: string
  description: string | null
  type: string
  series: string | null
  createdAt: Date
  _count: { cards: number }
  isLocal: true
}

/**
 * Get all user-imported local decks from IndexedDB
 */
export async function getLocalDecks(): Promise<LocalDeck[]> {
  if (typeof window === "undefined") return []
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("decks", "readonly")
      const store = tx.objectStore("decks")
      const request = store.getAll()

      request.onsuccess = () => {
        const rawList = (request.result || []) as Record<string, unknown>[]
        const decks: LocalDeck[] = rawList.map((d) => ({
          id: String(d.id || ""),
          title: String(d.title || ""),
          description: d.description ? String(d.description) : null,
          type: String(d.type || "flashcard"),
          series: d.series ? String(d.series) : null,
          createdAt: d.createdAt ? new Date(d.createdAt as string | number | Date) : new Date(),
          _count: typeof d._count === "object" && d._count !== null && "cards" in d._count
            ? { cards: Number((d._count as { cards?: unknown }).cards) || 0 }
            : { cards: 0 },
          isLocal: true
        }))
        resolve(decks)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn("Failed to load local decks from IndexedDB:", err)
    return []
  }
}

/**
 * Get a specific local deck by ID
 */
export async function getLocalDeck(deckId: string): Promise<LocalDeck | null> {
  if (typeof window === "undefined") return null
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("decks", "readonly")
      const store = tx.objectStore("decks")
      const request = store.get(deckId)

      request.onsuccess = () => {
        if (!request.result) return resolve(null)
        const d = request.result as Record<string, unknown>
        resolve({
          id: String(d.id || ""),
          title: String(d.title || ""),
          description: d.description ? String(d.description) : null,
          type: String(d.type || "flashcard"),
          series: d.series ? String(d.series) : null,
          createdAt: d.createdAt ? new Date(d.createdAt as string | number | Date) : new Date(),
          _count: typeof d._count === "object" && d._count !== null && "cards" in d._count
            ? { cards: Number((d._count as { cards?: unknown }).cards) || 0 }
            : { cards: 0 },
          isLocal: true
        })
      }
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn("Failed to get local deck:", err)
    return null
  }
}

/**
 * Get cards for a local deck
 */
export async function getLocalCards(deckId: string): Promise<RawDbCard[]> {
  if (typeof window === "undefined") return []
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("cards", "readonly")
      const store = tx.objectStore("cards")
      const index = store.index("deckId")
      const request = index.getAll(deckId)

      request.onsuccess = () => {
        const rawList = (request.result || []) as Record<string, unknown>[]
        const cards: RawDbCard[] = rawList.map((c) => ({
          id: String(c.id),
          deckId: String(c.deckId),
          deck: String(c.deckId),
          type: String(c.type),
          content: String(c.content)
        }))
        resolve(cards)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn("Failed to get local cards:", err)
    return []
  }
}

/**
 * Delete a local deck and its associated cards, progress, and exam results
 */
export async function deleteLocalDeck(deckId: string): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    const db = await openDB()
    const tx = db.transaction(["decks", "cards", "progress", "exam_results"], "readwrite")

    // Delete deck
    tx.objectStore("decks").delete(deckId)

    // Delete cards
    const cardStore = tx.objectStore("cards")
    const cardIndex = cardStore.index("deckId")
    const cardReq = cardIndex.getAllKeys(deckId)
    cardReq.onsuccess = () => {
      for (const key of cardReq.result) {
        cardStore.delete(key)
      }
    }

    // Delete progress
    const progressStore = tx.objectStore("progress")
    const progressIndex = progressStore.index("deckId")
    const progressReq = progressIndex.getAllKeys(deckId)
    progressReq.onsuccess = () => {
      for (const key of progressReq.result) {
        progressStore.delete(key)
      }
    }

    // Delete exam results
    const examStore = tx.objectStore("exam_results")
    const examIndex = examStore.index("deckId")
    const examReq = examIndex.getAllKeys(deckId)
    examReq.onsuccess = () => {
      for (const key of examReq.result) {
        examStore.delete(key)
      }
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        notifyLocalDbChange("deck_deleted")
        resolve(true)
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to delete local deck:", err)
    return false
  }
}

/**
 * Import a deck JSON string into IndexedDB
 */
export async function importJsonToLocalDb(
  jsonData: string,
  fileName: string,
  options?: { targetDeckId?: string; skipBroadcast?: boolean }
): Promise<{ success: boolean; deckId?: string; error?: string }> {
  try {
    let sanitized = jsonData.trim()
    if (sanitized.startsWith("```")) {
      sanitized = sanitized.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    }

    let parsedData: unknown
    try {
      parsedData = JSON.parse(sanitized)
    } catch {
      return { success: false, error: "Invalid JSON format. Please check file contents." }
    }

    const baseName = fileName.replace(/\.json$/i, "").trim()
    const safeSlug = baseName
      .replace(/[^a-zA-Z0-9\uAC00-\uD7A3\u3040-\u30FF\u4E00-\u9FFF_-]/g, "_")
      .toLowerCase()
    const deckId = options?.targetDeckId || `local_${safeSlug || "deck"}_${generateSimpleId(baseName)}`

    let rawData: Record<string, unknown>
    if (Array.isArray(parsedData)) {
      rawData = {
        title: fileName.replace(/\.json$/i, ""),
        type: "flashcard",
        cards: parsedData
      }
    } else if (parsedData && typeof parsedData === "object") {
      const obj = parsedData as Record<string, unknown>
      rawData = {
        title: obj.title || fileName.replace(/\.json$/i, ""),
        description: obj.description || null,
        type: obj.type || "flashcard",
        series: obj.series || null,
        cards: obj.cards || []
      }
    } else {
      return { success: false, error: "Invalid JSON structure." }
    }

    const validated = DeckSchema.parse(rawData)

    const cardsToStore: { id: string; deckId: string; type: string; content: string; createdAt: string }[] = []

    for (let index = 0; index < validated.cards.length; index++) {
      const item = validated.cards[index]
      const cardType = item.type || validated.type

      let serializedContent = ""
      let stableId = item.id ? String(item.id) : ""

      if (cardType === "vocabulary" || (item.word && item.meaning)) {
        stableId = stableId || `${deckId}_voc_${generateSimpleId(item.word || String(index))}`
        serializedContent = JSON.stringify({
          word: item.word || "",
          meaning: item.meaning || "",
          example: item.example || ""
        })
      } else if (cardType === "practice_quiz" || item.question) {
        stableId = stableId || `${deckId}_quiz_${generateSimpleId(item.question || String(index))}`
        serializedContent = JSON.stringify({
          category: item.category || "",
          question: item.question || "",
          options: item.options || [],
          answers: item.answers ?? (item.answer !== undefined ? [item.answer] : [0]),
          explanation: item.explanation || ""
        })
      } else {
        stableId = stableId || `${deckId}_fc_${generateSimpleId((item.front || "") + (item.back || String(index)))}`
        serializedContent = JSON.stringify({
          category: item.category || "",
          front: item.front || "",
          back: item.back || ""
        })
      }

      cardsToStore.push({
        id: stableId,
        deckId,
        type: cardType,
        content: serializedContent,
        createdAt: new Date().toISOString()
      })
    }

    const db = await openDB()
    const tx = db.transaction(["decks", "cards"], "readwrite")

    // Upsert deck
    const deckRecord = {
      id: deckId,
      title: validated.title,
      description: validated.description || null,
      type: validated.type,
      series: validated.series || null,
      createdAt: new Date().toISOString(),
      _count: { cards: cardsToStore.length },
      isLocal: true
    }
    tx.objectStore("decks").put(deckRecord)

    // Upsert cards
    const cardStore = tx.objectStore("cards")
    for (const card of cardsToStore) {
      cardStore.put(card)
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        if (!options?.skipBroadcast) {
          notifyLocalDbChange("deck_created")
        }
        resolve({ success: true, deckId })
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: "Validation error: " + err.issues.map(e => e.message).join(", ") }
    }
    return { success: false, error: (err as Error)?.message || "Failed to import deck" }
  }
}

export interface BatchImportItem {
  content: string
  fileName: string
  options?: { targetDeckId?: string }
}

export interface BatchImportResult {
  total: number
  successCount: number
  failedCount: number
  results: Array<{
    fileName: string
    success: boolean
    deckId?: string
    error?: string
  }>
}

/**
 * Import multiple deck JSON files in sequence.
 * Collects results per file and broadcasts 'deck_created' once if any deck succeeded.
 */
export async function importMultipleJsonToLocalDb(
  items: BatchImportItem[],
  onProgress?: (current: number, total: number) => void
): Promise<BatchImportResult> {
  const results: BatchImportResult['results'] = []
  let successCount = 0
  let failedCount = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const res = await importJsonToLocalDb(item.content, item.fileName, {
        ...item.options,
        skipBroadcast: true,
      })

      if (res.success) {
        successCount++
        results.push({
          fileName: item.fileName,
          success: true,
          deckId: res.deckId,
        })
      } else {
        failedCount++
        results.push({
          fileName: item.fileName,
          success: false,
          error: res.error,
        })
      }
    } catch (e) {
      failedCount++
      results.push({
        fileName: item.fileName,
        success: false,
        error: (e as Error)?.message || "Failed to process deck file",
      })
    }
    onProgress?.(i + 1, items.length)
  }

  if (successCount > 0) {
    notifyLocalDbChange("deck_created")
  }

  return {
    total: items.length,
    successCount,
    failedCount,
    results,
  }
}
