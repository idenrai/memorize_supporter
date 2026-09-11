import { openDB, notifyLocalDbChange } from "./core"
import { importJsonToLocalDb, getLocalDecks } from "./decks"

export interface RestoreBackupResult {
  success: boolean
  error?: string
  restoredCount?: {
    decks: number
    cards: number
    progress: number
    examResults: number
  }
}

/**
 * Export all local data (decks, cards, progress, exam results) as a JSON backup string
 */
export async function exportLocalDataJson(): Promise<string> {
  if (typeof window === "undefined") return "{}"
  try {
    const db = await openDB()
    const tx = db.transaction(["decks", "cards", "progress", "exam_results"], "readonly")
    const decksReq = tx.objectStore("decks").getAll()
    const cardsReq = tx.objectStore("cards").getAll()
    const progressReq = tx.objectStore("progress").getAll()
    const examsReq = tx.objectStore("exam_results").getAll()

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        const backup = {
          version: 1,
          exportedAt: new Date().toISOString(),
          decks: decksReq.result || [],
          cards: cardsReq.result || [],
          progress: progressReq.result || [],
          examResults: examsReq.result || []
        }
        resolve(JSON.stringify(backup, null, 2))
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to export local data:", err)
    return "{}"
  }
}

/**
 * Import and merge a JSON backup into IndexedDB
 */
export async function importBackupJson(jsonString: string): Promise<RestoreBackupResult> {
  if (typeof window === "undefined") {
    return { success: false, error: "IndexedDB is not available" }
  }

  try {
    const raw = JSON.parse(jsonString)
    if (!raw || typeof raw !== "object") {
      return { success: false, error: "Invalid JSON format" }
    }

    const decks = Array.isArray(raw.decks) ? raw.decks : []
    const cards = Array.isArray(raw.cards) ? raw.cards : []
    const progress = Array.isArray(raw.progress) ? raw.progress : []
    const examResults = Array.isArray(raw.examResults) ? raw.examResults : []

    if (decks.length === 0 && cards.length === 0 && progress.length === 0 && examResults.length === 0) {
      return { success: false, error: "No recognizable backup data found in file" }
    }

    const db = await openDB()
    const tx = db.transaction(["decks", "cards", "progress", "exam_results"], "readwrite")

    const deckStore = tx.objectStore("decks")
    for (const d of decks) {
      if (d && typeof d === "object" && "id" in d) {
        deckStore.put(d)
      }
    }

    const cardStore = tx.objectStore("cards")
    for (const c of cards) {
      if (c && typeof c === "object" && "id" in c) {
        cardStore.put(c)
      }
    }

    const progressStore = tx.objectStore("progress")
    for (const p of progress) {
      if (p && typeof p === "object" && "cardId" in p) {
        progressStore.put(p)
      }
    }

    const examStore = tx.objectStore("exam_results")
    for (const e of examResults) {
      if (e && typeof e === "object" && "id" in e) {
        examStore.put(e)
      }
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        notifyLocalDbChange("backup_restored")
        resolve({
          success: true,
          restoredCount: {
            decks: decks.length,
            cards: cards.length,
            progress: progress.length,
            examResults: examResults.length
          }
        })
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to restore backup:", err)
    return {
      success: false,
      error: (err as Error)?.message || "Failed to parse backup JSON"
    }
  }
}

/**
 * Loads sample decks from the /api/sample-decks endpoint and imports them into local IndexedDB.
 */
export async function importSampleDecks(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const res = await fetch('/api/sample-decks')
    if (!res.ok) {
      throw new Error(`Failed to fetch sample decks: ${res.statusText}`)
    }
    const data = await res.json()
    const decks: Array<{ filename: string; content: string }> = data.decks || []

    const existingDecks = await getLocalDecks()
    const existingTitles = new Set(existingDecks.map((d) => d.title.trim().toLowerCase()))
    const existingIds = new Set(existingDecks.map((d) => d.id))

    let count = 0
    for (const item of decks) {
      const baseName = item.filename.replace(/\.json$/i, "").trim()
      const deterministicDeckId = `sample_${baseName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_")}`

      if (existingIds.has(deterministicDeckId) || existingTitles.has(baseName.toLowerCase())) {
        continue
      }

      const result = await importJsonToLocalDb(item.content, item.filename, { targetDeckId: deterministicDeckId })
      if (result.success) {
        count++
        existingIds.add(deterministicDeckId)
        existingTitles.add(baseName.toLowerCase())
      }
    }

    if (count > 0) {
      notifyLocalDbChange('deck_created')
    }
    return { success: true, count }
  } catch (err) {
    console.error('Failed to import sample decks:', err)
    return { success: false, count: 0, error: (err as Error)?.message }
  }
}
