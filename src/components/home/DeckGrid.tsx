import type { Lang } from "@/i18n/types"
import DeckCard from "@/components/cards/DeckCard"
import type { Deck } from "./DeckGallery"

export default function DeckGrid({ decks, lang, globalLimit }: { decks: Deck[], lang: Lang, globalLimit: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DeckCard 
          key={deck.id} 
          deck={deck.id} 
          count={deck._count.cards} 
          deckName={deck.title} 
          description={deck.description}
          type={deck.type}
          lang={lang}
          globalLimit={globalLimit}
        />
      ))}
    </div>
  )
}
