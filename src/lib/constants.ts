/**
 * Application-wide configuration constants.
 * Safely parses NEXT_PUBLIC_* environment variables with robust fallback and NaN defense.
 */

// Pass mark percentage for exam mode (defaults to 80%)
const parsedPassMark = parseInt(process.env.NEXT_PUBLIC_PASS_MARK_PERCENT || "80", 10)
export const PASS_MARK_PERCENT: number =
  Number.isNaN(parsedPassMark) || parsedPassMark <= 0 || parsedPassMark > 100
    ? 80
    : parsedPassMark

// Max upload file size in megabytes (defaults to 5MB)
const parsedMaxUploadMb = parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB || "5", 10)
export const MAX_UPLOAD_SIZE_MB: number =
  Number.isNaN(parsedMaxUploadMb) || parsedMaxUploadMb <= 0
    ? 5
    : parsedMaxUploadMb

export const MAX_UPLOAD_SIZE_BYTES: number = MAX_UPLOAD_SIZE_MB * 1024 * 1024
