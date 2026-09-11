import { notFound } from "next/navigation"
import DeckGallery from "@/components/home/DeckGallery"
import { getT } from "@/i18n"
import { locales, type Locale } from "@/i18n/settings"
import type { Lang } from "@/i18n/types"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!locales.includes(lang as Locale)) {
    notFound()
  }

  const validLang = lang as Lang
  const t = getT(validLang)

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16 flex flex-col items-center">
      <div className="mb-8 sm:mb-10 w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 tracking-tight mb-3 break-keep text-balance">
          {t.home?.subtitle}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed break-keep text-balance font-medium">
          {t.home?.description}
        </p>
      </div>

      <DeckGallery lang={validLang} />
    </main>
  )
}
