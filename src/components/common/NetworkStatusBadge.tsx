"use client"

import { useEffect, useRef } from "react"
import { WifiOff } from "lucide-react"
import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"

export default function NetworkStatusBadge() {
  const { isOnline } = useNetworkStatus()
  const t = useT()
  const wasOffline = useRef(false)

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true
    } else if (wasOffline.current) {
      wasOffline.current = false
      toast.success(t.common.onlineRestored)
    }
  }, [isOnline, t.common.onlineRestored])

  if (isOnline) return null

  return (
    <button
      type="button"
      onClick={() => toast.info(t.common.offlineDesc, { id: "offline-status-info" })}
      role="status"
      aria-live="polite"
      aria-label={t.common.offline}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-xs backdrop-blur-xs transition-all hover:bg-amber-500/20 active:scale-95 cursor-pointer"
      title={t.common.offlineDesc}
    >
      <WifiOff size={13} className="text-amber-400 shrink-0 animate-pulse" aria-hidden="true" />
      <span className="hidden sm:inline">{t.common.offline}</span>
    </button>
  )
}
