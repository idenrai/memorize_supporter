"use client"

import { useState, useMemo, useDeferredValue, useCallback, useEffect } from "react"
import { Search, Library } from "lucide-react"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"
import SearchAndFilter from "./SearchAndFilter"
import DeckGrid from "./DeckGrid"
import DeckList from "./DeckList"

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
  const [globalLimit, setGlobalLimit] = useState<number>(10)
  const [globalIsExamMode, setGlobalIsExamMode] = useState<boolean>(false)
  const isStale = searchQuery !== deferredSearchQuery;

  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLimit = localStorage.getItem('memorize_globalLimit')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedLimit) setGlobalLimit(Number(savedLimit))
      
      const savedViewMode = localStorage.getItem('memorize_viewMode')
      if (savedViewMode === 'grid' || savedViewMode === 'list') setViewMode(savedViewMode)

      const savedIsExamMode = localStorage.getItem('memorize_globalIsExamMode')
      if (savedIsExamMode !== null) setGlobalIsExamMode(savedIsExamMode === 'true')
    } catch (e) {
      console.warn('Failed to load settings from local storage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when settings change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('memorize_globalLimit', globalLimit.toString())
      localStorage.setItem('memorize_viewMode', viewMode)
      localStorage.setItem('memorize_globalIsExamMode', globalIsExamMode.toString())
    } catch (e) {
      console.warn('Failed to save settings to local storage', e)
    }
  }, [globalLimit, viewMode, globalIsExamMode, isLoaded])

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
      <SearchAndFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSeries={selectedSeries}
        setSelectedSeries={setSelectedSeries}
        uniqueSeries={uniqueSeries}
        viewMode={viewMode}
        setViewMode={setViewMode}
        globalLimit={globalLimit}
        setGlobalLimit={setGlobalLimit}
        globalIsExamMode={globalIsExamMode}
        setGlobalIsExamMode={setGlobalIsExamMode}
      />



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
                  <DeckGrid decks={seriesDecks} lang={lang} globalLimit={globalLimit} globalIsExamMode={globalIsExamMode} />
                ) : (
                  <DeckList decks={seriesDecks} lang={lang} globalLimit={globalLimit} globalIsExamMode={globalIsExamMode} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
