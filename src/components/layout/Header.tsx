'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, FileJson, LayoutDashboard, Trophy } from "lucide-react"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import LanguageSwitch from "@/components/LanguageSwitch"
import BrandLogo from "@/components/common/BrandLogo"

export default function Header({ lang }: { lang: Lang }) {
  const t = useT()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === `/${lang}`) {
      return pathname === path || pathname === `${path}/`
    }
    return pathname.startsWith(path)
  }

  const navItemClass = (path: string) => `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
    isActive(path)
      ? 'text-white bg-blue-500/20 ring-1 ring-blue-500/50 shadow-inner'
      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
  }`

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md px-4 md:px-8 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href={`/${lang}`} className="group flex items-center gap-3 hover:opacity-90 transition-opacity">
          <BrandLogo size="md" />
          <span className="text-lg font-bold tracking-tight text-white hidden md:block group-hover:text-teal-300 transition-colors">
            {t.home.title}
          </span>
        </Link>
      </div>

      {/* Right: Navigation & Lang */}
      <div className="flex items-center gap-1 sm:gap-4">
        <nav className="flex items-center gap-1 sm:gap-2 mr-2">
          <Link 
            href={`/${lang}`} 
            className={navItemClass(`/${lang}`)}
            title={t.common.dashboard}
          >
            <LayoutDashboard size={16} />
            <span className="hidden lg:inline">{t.common.dashboard}</span>
          </Link>
          <Link 
            href={`/${lang}/records`} 
            className={navItemClass(`/${lang}/records`)}
            title={t.common.examRecords}
          >
            <Trophy size={16} />
            <span className="hidden lg:inline">{t.common.examRecords}</span>
          </Link>
          <Link 
            href={`/${lang}/data-management`} 
            className={navItemClass(`/${lang}/data-management`)}
            title={t.common.dataManagement}
          >
            <Database size={16} />
            <span className="hidden lg:inline">{t.common.dataManagement}</span>
          </Link>
          <Link 
            href={`/${lang}/data-preparation`} 
            className={navItemClass(`/${lang}/data-preparation`)}
            title={t.common.dataPrep}
          >
            <FileJson size={16} />
            <span className="hidden lg:inline">{t.common.dataPrep}</span>
          </Link>
        </nav>
        
        <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
        <LanguageSwitch />
      </div>
    </header>
  )
}
