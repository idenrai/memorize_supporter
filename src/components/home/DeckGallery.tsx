"use client"

import { useState, useMemo, useDeferredValue, useCallback } from "react"
import { Search, Library, LayoutGrid, List as ListIcon } from "lucide-react"
import DeckCard from "@/components/cards/DeckCard"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"
import Link from "next/link"

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
      <div className="relative text-center p-12 sm:p-16 mt-4 w-full glass-panel rounded-3xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-500">
            <Library size={36} aria-hidden="true" />
          </div>
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-4">{t.home.welcomeTitle}</h3>
          <p className="text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed text-lg text-balance">
            {t.home.welcomeDesc}
          </p>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-left max-w-2xl mx-auto border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
            <h4 className="text-zinc-200 font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              {t.home.howToAdd}
            </h4>
            <ol className="list-decimal list-inside space-y-4 text-base text-zinc-400 font-medium">
              <li>Create a JSON file containing your flashcards or quizzes.</li>
              <li>Place the file in <code className="bg-zinc-900/80 px-2 py-1 rounded-md text-indigo-400 border border-zinc-800">input/private</code> or <code className="bg-zinc-900/80 px-2 py-1 rounded-md text-indigo-400 border border-zinc-800">input/public</code> directory.</li>
              <li>Run <code className="bg-zinc-900/80 px-2 py-1 rounded-md text-teal-400 font-mono border border-zinc-800">npm run etl</code> in your terminal to load the data.</li>
              <li>Refresh this page and start studying!</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-400 group-focus-within:animate-pulse w-5 h-5 pointer-events-none z-20 transition-colors" aria-hidden="true" />
          <input 
            type="text" 
            name="search"
            autoComplete="off"
            placeholder={t.home.searchDecks} 
            aria-label={t.home.searchDecks}
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative z-10 w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 focus:border-indigo-500/50 transition-all duration-300 rounded-2xl py-4 pl-14 pr-6 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-lg text-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/30 p-2.5 rounded-2xl border border-white/5 backdrop-blur-sm">
          {uniqueSeries.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto px-1">
              <button
                onClick={() => setSelectedSeries("all")}
                aria-pressed={selectedSeries === "all"}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selectedSeries === "all" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
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
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    selectedSeries === series 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
                  }`}
                >
                  {series}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center bg-zinc-900/80 rounded-xl p-1 border border-zinc-800 shadow-inner ml-auto sm:ml-0">
            <button
              onClick={() => setViewMode("grid")}
              title={t.home.viewModeGrid}
              aria-pressed={viewMode === "grid"}
              className={`p-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title={t.home.viewModeList}
              aria-pressed={viewMode === "list"}
              className={`p-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "list" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <ListIcon size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="flex items-center gap-2 text-zinc-200 font-medium">
        <Library size={20} className="text-indigo-400" aria-hidden="true" />
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
                
                {viewMode === "grid" ? (
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
                ) : (
                  <div className="flex flex-col gap-3">
                    {seriesDecks.map((deck) => (
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
