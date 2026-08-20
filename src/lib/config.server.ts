import { clientConfig } from "./config.client"

/**
 * Server-only configuration object.
 * Inherits clientConfig and adds server-only secrets/tunings.
 * DO NOT import this file in Client Components.
 */
export const serverConfig = {
  ...clientConfig,
  
  // Database Tuning
  dbChunkSize: parseInt(process.env.DB_CHUNK_SIZE || '50', 10),
  
  // Security & Limits (Server-side specific)
  // Maximum number of card result logs in a single exam submission
  maxSessionResults: parseInt(process.env.MAX_SESSION_RESULTS || '2000', 10),
  
  // Learning Algorithm
  // Interval to set the next review when the user gets a card wrong (in minutes)
  failedReviewIntervalMinutes: parseInt(process.env.FAILED_REVIEW_INTERVAL_MINUTES || '10', 10),
}
