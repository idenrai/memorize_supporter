'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, FileJson, Info, LayoutDashboard, Trophy } from "lucide-react"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import LanguageSwitch from "@/components/LanguageSwitch"
import BrandLogo from "@/components/common/BrandLogo"
import NetworkStatusBadge from "@/components/common/NetworkStatusBadge"

export default function Header({ lang }: { lang: Lang }) {
  const t = useT()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === `/${lang}`) {
      return pathname === path || pathname === `${path}/`
    }
    return pathname.startsWith(path)
  }

  const navItemClass = (path: string) => `flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 ${
    isActive(path)
      ? 'text-zinc-100 bg-zinc-800 border border-zinc-700/80 shadow-xs'
      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
  }`

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 md:px-8 shadow-xs">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href={`/${lang}`} className="group flex items-center gap-3 hover:opacity-90 transition-opacity">
          <BrandLogo size="md" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 hidden md:block group-hover:text-indigo-400 transition-colors">
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
            aria-label={t.common.dashboard}
            aria-current={isActive(`/${lang}`) ? "page" : undefined}
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            <span className="hidden lg:inline">{t.common.dashboard}</span>
          </Link>
          <Link 
            href={`/${lang}/records`} 
            className={navItemClass(`/${lang}/records`)}
            title={t.common.examRecords}
            aria-label={t.common.examRecords}
            aria-current={isActive(`/${lang}/records`) ? "page" : undefined}
          >
            <Trophy size={16} aria-hidden="true" />
            <span className="hidden lg:inline">{t.common.examRecords}</span>
          </Link>
          <Link 
            href={`/${lang}/data-management`} 
            className={navItemClass(`/${lang}/data-management`)}
            title={t.common.dataManagement}
            aria-label={t.common.dataManagement}
            aria-current={isActive(`/${lang}/data-management`) ? "page" : undefined}
          >
            <Database size={16} aria-hidden="true" />
            <span className="hidden lg:inline">{t.common.dataManagement}</span>
          </Link>
          <Link 
            href={`/${lang}/data-preparation`} 
            className={navItemClass(`/${lang}/data-preparation`)}
            title={t.common.dataPrep}
            aria-label={t.common.dataPrep}
            aria-current={isActive(`/${lang}/data-preparation`) ? "page" : undefined}
          >
            <FileJson size={16} aria-hidden="true" />
            <span className="hidden lg:inline">{t.common.dataPrep}</span>
          </Link>
          <Link 
            href={`/${lang}/about`} 
            className={navItemClass(`/${lang}/about`)}
            title={t.common.about}
            aria-label={t.common.about}
            aria-current={isActive(`/${lang}/about`) ? "page" : undefined}
          >
            <Info size={16} aria-hidden="true" />
            <span className="hidden lg:inline">{t.common.about}</span>
          </Link>
        </nav>
        
        <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
        <NetworkStatusBadge />
        <LanguageSwitch />
      </div>
    </header>
  )
}
