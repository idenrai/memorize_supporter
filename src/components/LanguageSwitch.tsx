'use client'

import { Globe } from 'lucide-react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { setLanguageCookie } from '@/actions/i18n'
import type { Lang } from '@/i18n/types'
import { LANG_NAMES } from '@/i18n/types'

import CustomSelect from './ui/CustomSelect'

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

  const handleLangChange = (newLang: Lang) => {
    setLanguageCookie(newLang)
    if (pathname) {
      const newPath = pathname.replace(`/${lang}`, `/${newLang}`)
      router.replace(newPath)
    }
  }

  return (
    <CustomSelect
      value={lang}
      onChange={handleLangChange}
      ariaLabel="Change Language"
      className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black"
      dropdownClassName="min-w-[140px]"
      trigger={
        <>
          <Globe className="size-4" />
          <span className="text-xs font-bold uppercase">{LANG_LABELS[lang] || "US"}</span>
        </>
      }
      options={(Object.keys(LANG_NAMES) as Lang[]).map((l) => ({
        label: `${LANG_NAMES[l]} (${LANG_LABELS[l]})`,
        value: l
      }))}
    />
  )
}
