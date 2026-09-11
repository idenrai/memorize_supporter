import { openDB, notifyLocalDbChange } from "./core"

export interface LocalProgress {
  id: string
  cardId: string
  deckId: string
  reviewCount: number
  lastReviewedAt: Date | null
  nextReviewAt: Date | null
  successRate: number | null
}

/**
 * Update SRS progress for a local card in IndexedDB
 */
export async function updateLocalProgress(
  cardId: string,
  deckId: string,
  isCorrect: boolean
): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    const db = await openDB()
    const tx = db.transaction("progress", "readwrite")
    const store = tx.objectStore("progress")

    return new Promise((resolve, reject) => {
      const getReq = store.get(cardId)
      getReq.onsuccess = () => {
        const existing = getReq.result || {
          cardId,
          deckId,
          reviewCount: 0,
          successRate: 0
        }

        const newReviewCount = (existing.reviewCount || 0) + 1
        const prevSuccessRate = existing.successRate !== undefined ? existing.successRate : 0
        const newSuccessRate = ((prevSuccessRate * (newReviewCount - 1)) + (isCorrect ? 1 : 0)) / newReviewCount

        // Interval calculation based on Ebbinghaus forgetting curve
        let daysToAdd = 1
        if (isCorrect) {
          if (newReviewCount === 1) daysToAdd = 1
          else if (newReviewCount === 2) daysToAdd = 3
          else if (newReviewCount === 3) daysToAdd = 7
          else daysToAdd = Math.min(30, Math.pow(2, newReviewCount - 1))
        } else {
          daysToAdd = 1
        }

        const now = new Date()
        const nextReview = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

        const updated = {
          cardId,
          deckId,
          reviewCount: newReviewCount,
          lastReviewedAt: now.toISOString(),
          nextReviewAt: nextReview.toISOString(),
          successRate: newSuccessRate
        }

        store.put(updated)
      }

      tx.oncomplete = () => {
        notifyLocalDbChange("progress_updated")
        resolve(true)
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.error("Failed to update local progress:", err)
    return false
  }
}

/**
 * Get all progress items for a local deck
 */
export async function getLocalProgressMap(deckId: string): Promise<Record<string, LocalProgress>> {
  if (typeof window === "undefined") return {}
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction("progress", "readonly")
      const store = tx.objectStore("progress")
      const index = store.index("deckId")
      const req = index.getAll(deckId)

      req.onsuccess = () => {
        const map: Record<string, LocalProgress> = {}
        for (const item of (req.result || [])) {
          map[item.cardId] = {
            ...item,
            lastReviewedAt: item.lastReviewedAt ? new Date(item.lastReviewedAt) : null,
            nextReviewAt: item.nextReviewAt ? new Date(item.nextReviewAt) : null
          }
        }
        resolve(map)
      }
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn("Failed to get local progress map:", err)
    return {}
  }
}
