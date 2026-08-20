/**
 * Client-safe configuration object.
 * Only contains NEXT_PUBLIC_ variables. Safe to import anywhere, including Client Components.
 */
export const clientConfig = {
  // Security & Limits
  // Maximum size for JSON deck uploads in MB
  maxUploadBytes: parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB || '5', 10) * 1024 * 1024,
  
  // App Policies
  // Percentage required to show the "success" effect (🎉) at the end of a session
  passMarkPercent: parseInt(process.env.NEXT_PUBLIC_PASS_MARK_PERCENT || '80', 10),
}
