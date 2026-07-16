import { Brain, Settings } from "lucide-react"
import DeckGallery from "@/components/home/DeckGallery"
import prisma from "@/lib/prisma"
import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import LanguageSwitch from "@/components/LanguageSwitch"

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // Fetch available decks dynamically using Next.js Server Components
  const decks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { cards: true }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  const t = getT(lang as Lang)

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-4 sm:px-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="text-white w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t.home.title}<span className="text-blue-500">{t.home.subtitle}</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          <button aria-label={t.common.settings} className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
            <Settings size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="mb-12 w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            {t.home.welcomeTitle}
          </h2>
          <p className="text-lg text-gray-400 max-w-xl">
            {t.home.description}
          </p>
        </div>

        <DeckGallery decks={decks} lang={lang} />
      </main>
    </div>
  )
}
