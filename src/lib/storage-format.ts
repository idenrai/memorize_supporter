/**
 * Formats megabytes (MB) into a concise human-readable storage string (MB or GB).
 */
export function formatStorageMB(mb: number): string {
  if (mb <= 0) return "0 MB"
  if (mb < 0.1) return "< 0.1 MB"
  if (mb < 1000) {
    const rounded = Math.round((mb + Number.EPSILON) * 10) / 10
    return `${rounded} MB`
  }
  const gb = Math.round(((mb / 1024) + Number.EPSILON) * 10) / 10
  return `${gb} GB`
}
