"use client"

import { useEffect } from "react"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"

export default function ServiceWorkerRegister() {
  const t = useT()

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const isDev = process.env.NODE_ENV === "development"
    const allowDevSw = window.localStorage.getItem("ENABLE_DEV_SW") === "true"

    // In development mode, unregister existing service workers and skip registration
    // to avoid HMR cache conflicts unless explicitly enabled via localStorage.
    if (isDev && !allowDevSw) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister()
        }
      })
      return
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        })

        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                toast.info(t.common.updateAvailable, {
                  action: {
                    label: t.common.reload,
                    onClick: () => {
                      if (registration.waiting) {
                        registration.waiting.postMessage({ type: "SKIP_WAITING" })
                      }
                      window.location.reload()
                    },
                  },
                  duration: 10000,
                })
              }
            })
          }
        })
      } catch (err) {
        console.warn("[SW] Registration failed:", err)
      }
    }

    if (document.readyState === "complete") {
      registerSW()
    } else {
      window.addEventListener("load", registerSW)
      return () => window.removeEventListener("load", registerSW)
    }
  }, [t.common.updateAvailable, t.common.reload])

  return null
}

