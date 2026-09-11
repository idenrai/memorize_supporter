import { openDB, notifyLocalDbChange, generateSimpleId } from "./core"

export interface LocalExamResult {
  id: string
  deckId: string
  score: number
  total: number
  correct: number
  createdAt: Date
  details: {
    cardId: string
    isCorrect: boolean
    selectedIndices?: number[]
  }[]
}

/**
 * Save an exam result to IndexedDB
 */
export async function saveLocalExamResult(result: {
  deckId: string
  score: number
  total: number
  correct: number
  details: { cardId: string; isCorrect: boolean; selectedIndices?: number[] }[]
}): Promise<string> {
  if (typeof window === "undefined") return ""
  try {
    const db = await openDB()
    const tx = db.transaction("exam_results", "readwrite")
    const store = tx.objectStore("exam_results")

    const resultId = "exam_" + generateSimpleId(result.deckId)
    const record = {
      id: resultId,
      deckId: result.deckId,
      score: result.score,
      total: result.total,
      correct: result.correct,
      createdAt: new Date().toISOString(),
      details: result.details
    }

    return new Promise((resolve, reject) => {
      store.put(record)
      tx.oncomplete = () => {
        notifyLocalDbChange("exam_saved")
        resolve(resultId)
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to save local exam result:", err)
    return ""
  }
}

/**
 * Get exam results for a local deck
 */
export async function getLocalExamResults(deckId?: string): Promise<LocalExamResult[]> {
  if (typeof window === "undefined") return []
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("exam_results", "readonly")
      const store = tx.objectStore("exam_results")

      let req: IDBRequest
      if (deckId) {
        const index = store.index("deckId")
        req = index.getAll(deckId)
      } else if (store.indexNames.contains("createdAt")) {
        const index = store.index("createdAt")
        req = index.getAll()
      } else {
        req = store.getAll()
      }

      req.onsuccess = () => {
        const rawList = (req.result || []) as Record<string, unknown>[]
        const list: LocalExamResult[] = rawList.map((r) => ({
          id: String(r.id || ""),
          deckId: String(r.deckId || ""),
          score: Number(r.score) || 0,
          total: Number(r.total) || 0,
          correct: Number(r.correct) || 0,
          createdAt: r.createdAt ? new Date(r.createdAt as string | number | Date) : new Date(),
          details: Array.isArray(r.details)
            ? (r.details as LocalExamResult["details"]).map((d) => ({
                cardId: String(d.cardId || ""),
                isCorrect: Boolean(d.isCorrect),
                ...(d.selectedIndices ? { selectedIndices: d.selectedIndices } : {})
              }))
            : []
        }))
        list.sort((a: LocalExamResult, b: LocalExamResult) => b.createdAt.getTime() - a.createdAt.getTime())
        resolve(list)
      }
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn("Failed to get local exam results:", err)
    return []
  }
}

/**
 * Get a single local exam result by ID
 */
export async function getLocalExamResult(resultId: string): Promise<LocalExamResult | null> {
  if (typeof window === "undefined") return null
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("exam_results", "readonly")
      const store = tx.objectStore("exam_results")
      const req = store.get(resultId)

      req.onsuccess = () => {
        if (!req.result) return resolve(null)
        const r = req.result as Record<string, unknown>
        resolve({
          id: String(r.id || ""),
          deckId: String(r.deckId || ""),
          score: Number(r.score) || 0,
          total: Number(r.total) || 0,
          correct: Number(r.correct) || 0,
          createdAt: r.createdAt ? new Date(r.createdAt as string | number | Date) : new Date(),
          details: Array.isArray(r.details)
            ? (r.details as LocalExamResult["details"]).map((d) => ({
                cardId: String(d.cardId || ""),
                isCorrect: Boolean(d.isCorrect),
                ...(d.selectedIndices ? { selectedIndices: d.selectedIndices } : {})
              }))
            : []
        })
      }
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn("Failed to get local exam result:", err)
    return null
  }
}

/**
 * Delete a single local exam result by ID
 */
export async function deleteLocalExamResult(resultId: string): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    const db = await openDB()
    const tx = db.transaction("exam_results", "readwrite")
    const store = tx.objectStore("exam_results")
    store.delete(resultId)
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        notifyLocalDbChange("exam_deleted")
        resolve(true)
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to delete local exam result:", err)
    return false
  }
}
