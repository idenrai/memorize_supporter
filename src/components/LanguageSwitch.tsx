'use client'

import { Globe } from 'lucide-react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { setLanguageCookie } from '@/actions/i18n'
import type { Lang } from '@/i18n/types'
import { LANG_NAMES } from '@/i18n/types'

const LANG_LABELS: Record<Lang, string> = {
  ko: "KR",
  en: "US",
  ja: "JP",
}

export default function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const lang = (params?.lang as Lang) || "en"

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang
    setLanguageCookie(newLang)
    if (pathname) {
      const newPath = pathname.replace(`/${lang}`, `/${newLang}`)
      router.replace(newPath)
    }
  }

  return (
    <div className="relative flex items-center justify-center rounded-md has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-white has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-black">
      <button
        aria-hidden="true"
        className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
      >
        <Globe className="size-4" />
        <span className="text-xs font-bold uppercase">{LANG_LABELS[lang] || "US"}</span>
      </button>
      <select
        title="Change Language"
        aria-label="Change Language"
        value={lang}
        onChange={handleLangChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
          <option key={l} value={l} className="text-black">
            {LANG_NAMES[l]} ({LANG_LABELS[l]})
          </option>
        ))}
      </select>
    </div>
  )
}
