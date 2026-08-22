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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#1c1f26] border border-red-900/50 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t.error.somethingWentWrong}</h2>
        <p className="text-gray-400 mb-8 text-sm">
          {error.message || t.error.defaultMessage}
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/${lang}`)}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            {t.error.goHome}
          </button>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {t.error.tryAgain}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
