import { notFound } from "next/navigation"
import DeckGallery from "@/components/home/DeckGallery"
import { getAvailableDecks } from "@/lib/server-decks"
import { getT } from "@/i18n"
import { locales, type Locale } from "@/i18n/settings"
import type { Lang } from "@/i18n/types"

export const dynamic = 'force-dynamic'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  const validLang = lang as Lang;

  // Fetch available decks dynamically with database resilience and filesystem fallback
  const decks = await getAvailableDecks()

  const t = getT(validLang)

  return (
    <div className="flex flex-col items-center pt-8 md:pt-12 px-4 sm:px-8">
      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="mb-12 w-full text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 break-keep">
            {t.home.subtitle}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed break-keep">
            {t.home.description}
          </p>
        </div>

        <DeckGallery decks={decks} lang={lang as Lang} />
      </main>
    </div>
  )
}

