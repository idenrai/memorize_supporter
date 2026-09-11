import { DeckSchema } from "@/schemas/deck"
import type { RawDbCard } from "./card-parser"
export type { RawDbCard }
import { z } from "zod"

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

export interface LocalProgress {
  id: string
  cardId: string
  deckId: string
  reviewCount: number
  lastReviewedAt: Date | null
  nextReviewAt: Date | null
  successRate: number | null
}

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

const DB_NAME = "memorize_supporter_local_db"
const DB_VERSION = 2

let cachedDbPromise: Promise<IDBDatabase> | null = null

export function openDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available in this environment"))
  }

  if (cachedDbPromise) {
    return cachedDbPromise
  }

  cachedDbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains("decks")) {
        db.createObjectStore("decks", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("cards")) {
        const cardStore = db.createObjectStore("cards", { keyPath: "id" })
        cardStore.createIndex("deckId", "deckId", { unique: false })
      }

      if (!db.objectStoreNames.contains("progress")) {
        const progressStore = db.createObjectStore("progress", { keyPath: "cardId" })
        progressStore.createIndex("deckId", "deckId", { unique: false })
      }

      let examStore: IDBObjectStore
      if (!db.objectStoreNames.contains("exam_results")) {
        examStore = db.createObjectStore("exam_results", { keyPath: "id" })
        examStore.createIndex("deckId", "deckId", { unique: false })
      } else {
        examStore = (event.target as IDBOpenDBRequest).transaction!.objectStore("exam_results")
      }

      // Add createdAt index in v2 for fast reverse-chronological retrieval
      if (!examStore.indexNames.contains("createdAt")) {
        examStore.createIndex("createdAt", "createdAt", { unique: false })
      }
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        cachedDbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      cachedDbPromise = null
      reject(request.error)
    }

    request.onblocked = () => {
      console.warn("IndexedDB upgrade blocked: Please close other tabs of this site.")
    }
  })

  return cachedDbPromise
}

export type LocalDbEventType =
  | "deck_created"
  | "deck_deleted"
  | "exam_saved"
  | "exam_deleted"
  | "progress_updated"
  | "backup_restored"

let dbChannel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null
  if (!dbChannel) {
    dbChannel = new BroadcastChannel("memorize_db_events")
  }
  return dbChannel
}

export function notifyLocalDbChange(event: LocalDbEventType): void {
  try {
    const channel = getChannel()
    if (channel) {
      channel.postMessage({ type: event, timestamp: Date.now() })
    }
  } catch (e) {
    console.warn("Failed to broadcast local DB event", e)
  }
}

export function onLocalDbChange(callback: (event: LocalDbEventType) => void): () => void {
  if (typeof window === "undefined") return () => {}
  const channel = getChannel()
  if (!channel) return () => {}

  const handler = (msg: MessageEvent) => {
    if (msg.data?.type) {
      callback(msg.data.type as LocalDbEventType)
    }
  }

  channel.addEventListener("message", handler)
  return () => {
    channel.removeEventListener("message", handler)
  }
}

/**
 * Request persistent storage from the browser to prevent eviction (e.g. Safari 7-day ITP)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.storage?.persist) return false
  try {
    const isPersisted = await navigator.storage.persist()
    return isPersisted
  } catch (e) {
    console.warn("Failed to request persistent storage", e)
    return false
  }
}

/**
 * Check if the current origin has persistent storage granted
 */
export async function checkStoragePersistence(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.storage?.persisted) return false
  try {
    return await navigator.storage.persisted()
  } catch {
    return false
  }
}

export interface StorageEstimateResult {
  usageMB: number
  quotaMB: number
  percentUsed: number
  persisted: boolean
}

/**
 * Get current browser storage quota and usage estimates
 */
export async function getStorageEstimate(): Promise<StorageEstimateResult> {
  if (typeof window === "undefined" || !navigator.storage?.estimate) {
    return { usageMB: 0, quotaMB: 0, percentUsed: 0, persisted: false }
  }
  try {
    const estimate = await navigator.storage.estimate()
    const persisted = await checkStoragePersistence()
    const usageMB = Math.round(((estimate.usage || 0) / (1024 * 1024)) * 100) / 100
    const quotaMB = Math.round(((estimate.quota || 0) / (1024 * 1024)) * 100) / 100
    const percentUsed = estimate.quota ? Math.round(((estimate.usage || 0) / estimate.quota) * 100) : 0

    return { usageMB, quotaMB, percentUsed, persisted }
  } catch (e) {
    console.warn("Failed to estimate storage", e)
    return { usageMB: 0, quotaMB: 0, percentUsed: 0, persisted: false }
  }
}

// Helper for simple hash generation in browser without crypto node module
function generateSimpleId(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36) + Math.random().toString(36).substring(2, 8)
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
          ...(d as unknown as LocalDeck),
          createdAt: d.createdAt ? new Date(d.createdAt as string) : new Date(),
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
        const d = request.result
        resolve({
          ...d,
          createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
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
  fileName: string
): Promise<{ success: boolean; deckId?: string; error?: string }> {
  try {
    let parsedData: unknown
    try {
      parsedData = JSON.parse(jsonData)
    } catch {
      return { success: false, error: "Invalid JSON format. Please check file contents." }
    }

    const deckId = "local_" + fileName.replace(/\.json$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()

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
        notifyLocalDbChange("deck_created")
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
          ...(r as unknown as LocalExamResult),
          createdAt: new Date(r.createdAt as string)
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


