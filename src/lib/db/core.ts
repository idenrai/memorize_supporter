/**
 * Core IndexedDB connection, schema definition, and cross-tab event bus.
 */

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
 * Request persistent storage from the browser to prevent eviction
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

export function generateSimpleId(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36) + Math.random().toString(36).substring(2, 8)
}
