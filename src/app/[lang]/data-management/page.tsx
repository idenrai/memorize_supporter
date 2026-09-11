import DataManagementClient from './DataManagementClient'
import { getT } from '@/i18n'
import type { Lang } from '@/i18n/types'

export default async function DataManagementPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getT(lang as Lang)

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 tracking-tight break-keep">
          {t.management?.title || "Data Management"}
        </h1>
        <p className="text-zinc-400 max-w-3xl font-medium leading-relaxed break-keep text-base">
          {t.management?.desc || "Manage flashcard decks and quizzes."}
        </p>
      </div>
      
      <DataManagementClient />
    </main>
  )
}
