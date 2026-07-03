"use client"

import { LANG_NAMES } from "@/i18n/types"
import type { Lang } from "@/i18n/types"
import { useRouter, usePathname, useParams } from "next/navigation"
import { setLanguageCookie } from "@/actions/i18n"

export default function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const lang = (params?.lang as Lang) || "en"

  return (
    <select 
      value={lang}
      onChange={(e) => {
        const newLang = e.target.value as Lang
        setLanguageCookie(newLang)
        // Switch the language in the URL (e.g. /en/foo -> /ko/foo)
        if (pathname) {
          const newPath = pathname.replace(`/${lang}`, `/${newLang}`)
          router.replace(newPath)
        }
      }}
      className="bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {Object.entries(LANG_NAMES).map(([key, name]) => (
        <option key={key} value={key}>
          {name}
        </option>
      ))}
    </select>
  )
}
