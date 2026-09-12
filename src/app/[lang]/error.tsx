"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useT } from "@/hooks/useT"
import { useParams, useRouter } from "next/navigation"
import type { Lang } from "@/i18n/types"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useT()
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as Lang) || "en"

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Next.js Error Boundary Caught:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-precision max-w-md w-full p-8 flex flex-col items-center text-center shadow-2xl"
      >
        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center mb-5">
          <AlertCircle className="w-6 h-6 text-rose-400" aria-hidden="true" />
        </div>
        
        <h2 className="text-xl font-bold text-zinc-100 mb-2">{t.error.somethingWentWrong}</h2>
        <p className="text-zinc-400 mb-6 text-xs sm:text-sm leading-relaxed font-normal">
          {error.message || t.error.defaultMessage}
        </p>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${lang}`)}
            className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
          >
            {t.error.goHome}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
          >
            {t.error.tryAgain}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
