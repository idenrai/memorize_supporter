import Link from "next/link"
import type { Lang } from "@/i18n/types"
import { useT } from "@/hooks/useT"
import type { Deck } from "./DeckGallery"

export default function DeckList({ decks, lang }: { decks: Deck[], lang: Lang }) {
  const t = useT()
  
  return (
    <div className="flex flex-col gap-3">
      {decks.map((deck) => (
        <div key={deck.id} className="flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 rounded-2xl transition-colors group">
          <div className="flex items-center gap-4 flex-1 overflow-hidden min-w-0">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold shrink-0">
              {deck.type.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate min-w-0 flex-1">
              <span className="font-bold text-zinc-100 truncate text-lg block group-hover:text-indigo-300 transition-colors">{deck.title}</span>
              <span className="text-sm text-zinc-400 truncate flex items-center gap-2">
                <span className="capitalize shrink-0">{deck.type}</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full shrink-0" />
                <span className="shrink-0">{deck._count.cards} {t.home.cards}</span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <Link 
              href={`/${lang}/deck/${deck.id}?limit=0`}
              className="px-5 py-2 rounded-full text-sm btn-indigo-outline"
            >
              {t.common.study}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
