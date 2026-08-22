import { getDecks } from '@/actions/deck'
import DataManagementClient from './DataManagementClient'

import { getT } from '@/i18n'
import type { Lang } from '@/i18n/types'

export default async function DataManagementPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Lang);
  const decks = await getDecks(true) // include hidden decks

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-8 md:pt-12">
      <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">{t.management.title}</h1>
      <p className="text-zinc-400 mb-10 max-w-3xl font-medium leading-relaxed break-keep text-base">
        {t.management.desc}
      </p>
      
      <DataManagementClient initialDecks={decks} lang={lang as Lang} />
    </div>
  )
}
