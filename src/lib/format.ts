/**
 * formatText: Safely replaces all variations of newline characters and `<br>` tags
 * in the raw JSON string with actual '\n' line feed characters, allowing React to
 * render them properly when CSS `whitespace-pre-wrap` is applied.
 * 
 * Handled cases:
 * - Literal '\n' string
 * - Literal '\r\n' string
 * - Actual Carriage Return / Line Feeds (\r, \n)
 * - HTML break tags (<br>, <br/>, <br />)
 */
export const formatText = (text: string | null | undefined): string => {
  if (!text) return ""
  
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
}

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
