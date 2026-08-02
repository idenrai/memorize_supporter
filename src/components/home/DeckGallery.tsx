"use client"

import { useState, useMemo, useDeferredValue, useCallback } from "react"
import { Search, Library } from "lucide-react"
import DeckCard from "@/components/cards/DeckCard"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"

export type Deck = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  series: string | null;
  createdAt: Date;
  _count: { cards: number };
}

interface DeckGalleryProps {
  decks: Deck[];
  lang: Lang;
}

export default function DeckGallery({ decks, lang }: DeckGalleryProps) {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [selectedSeries, setSelectedSeries] = useState<string>("all")
  const isStale = searchQuery !== deferredSearchQuery;

  const sortSeries = useCallback((a: string, b: string) => {
    if (a === t.home.uncategorized) return 1;
    if (b === t.home.uncategorized) return -1;
    return a.localeCompare(b);
  }, [t.home.uncategorized]);

  const uniqueSeries = useMemo(() => {
    const seriesSet = new Set<string>()
    decks.forEach(deck => {
      seriesSet.add(deck.series || t.home.uncategorized)
    })
    return Array.from(seriesSet).sort(sortSeries)
  }, [decks, sortSeries, t.home.uncategorized])

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => {
      const matchesSearch = deck.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) || 
                            (deck.description?.toLowerCase() || "").includes(deferredSearchQuery.toLowerCase());
      
      const seriesName = deck.series || t.home.uncategorized;
      const matchesSeries = selectedSeries === "all" || seriesName === selectedSeries;

      return matchesSearch && matchesSeries;
    })
  }, [decks, deferredSearchQuery, selectedSeries, t.home.uncategorized])

  const groupedDecks = useMemo(() => {
    const grouped = filteredDecks.reduce((acc, deck) => {
      const key = deck.series || t.home.uncategorized;
      if (!acc[key]) acc[key] = [];
      acc[key].push(deck);
      return acc;
    }, {} as Record<string, typeof decks>);

    return Object.keys(grouped)
      .sort(sortSeries)
      .map((key) => {
        const sortedDecks = grouped[key].sort((a, b) => 
          a.title.localeCompare(b.title, undefined, { numeric: true })
        );
        return [key, sortedDecks] as [string, typeof decks];
      });
  }, [filteredDecks, sortSeries, t.home.uncategorized])

  if (decks.length === 0) {
    return (
      <div className="text-center p-12 sm:p-16 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl mt-4 w-full">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Library size={32} aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{t.home.welcomeTitle}</h3>
        <p className="text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          {t.home.welcomeDesc}
        </p>
        
        <div className="bg-zinc-800/50 rounded-xl p-6 text-left max-w-2xl mx-auto border border-zinc-700/50">
          <h4 className="text-zinc-200 font-semibold mb-4">{t.home.howToAdd}</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-zinc-400">
            <li>Create a JSON file containing your flashcards or quizzes.</li>
            <li>Place the file in <code className="bg-zinc-900 px-2 py-1 rounded text-blue-400">input/private</code> or <code className="bg-zinc-900 px-2 py-1 rounded text-blue-400">input/public</code> directory.</li>
            <li>Run <code className="bg-zinc-900 px-2 py-1 rounded text-green-400 font-mono">npm run etl</code> in your terminal to load the data.</li>
            <li>Refresh this page and start studying!</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-2xl w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 pointer-events-none" aria-hidden="true" />
          <input 
            type="text" 
            name="search"
            autoComplete="off"
            placeholder={t.home.searchDecks} 
            aria-label={t.home.searchDecks}
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 focus:bg-zinc-900 transition-all rounded-2xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-sm"
          />
        </div>

        {uniqueSeries.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
            <button
              onClick={() => setSelectedSeries("all")}
              aria-pressed={selectedSeries === "all"}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedSeries === "all" 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
              }`}
            >
              {t.home.allSeries}
            </button>
            {uniqueSeries.map(series => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                aria-pressed={selectedSeries === series}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  selectedSeries === series 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Decks Grid */}
      <div className="flex items-center gap-2 text-zinc-300 font-medium">
        <Library size={20} className="text-blue-500" aria-hidden="true" />
        <h3>{t.home.yourDecks}</h3>
      </div>

      <div className={`w-full transition-opacity duration-200 ${isStale ? "opacity-50" : "opacity-100"}`}>
        {filteredDecks.length === 0 ? (
          <div className="text-center p-12 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl mt-2 w-full">
            <Search size={32} className="text-zinc-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">{t.home.noSearchResults}</h3>
          </div>
        ) : (
          <div className="flex flex-col gap-12 w-full">
            {groupedDecks.map(([seriesName, seriesDecks]) => (
              <div key={seriesName} className="mb-2">
                <div className="flex items-center gap-2 mb-6 text-zinc-300 font-medium border-b border-zinc-800/80 pb-3">
                  <h4 className="text-xl font-semibold text-white">
                    {seriesName}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {seriesDecks.map((deck) => (
                    <DeckCard 
                      key={deck.id} 
                      deck={deck.id} 
                      count={deck._count.cards} 
                      deckName={deck.title} 
                      description={deck.description}
                      type={deck.type}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
