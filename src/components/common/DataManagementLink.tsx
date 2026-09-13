"use client"

import Link from "next/link"
import { Database, ArrowRight } from "lucide-react"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"

interface DataManagementLinkProps {
  lang: Lang
  showArrow?: boolean
  className?: string
}

export default function DataManagementLink({
  lang,
  showArrow = false,
  className = ""
}: DataManagementLinkProps) {
  const t = useT()

  return (
    <Link
      href={`/${lang}/data-management`}
      className={`inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
      title={t.common.dataManagement}
    >
      <Database size={13} className="text-indigo-400" aria-hidden="true" />
      <span>{t.common.dataManagement}</span>
      {showArrow && <ArrowRight size={12} aria-hidden="true" />}
    </Link>
  )
}
