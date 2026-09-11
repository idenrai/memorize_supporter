"use client"

import { useState, useMemo, useDeferredValue, useCallback, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  Brain,
  FolderKanban,
  Library
} from "lucide-react"
import { useT } from "@/hooks/useT"
import type { Lang } from "@/i18n/types"
import {
  getLocalDecks,
  deleteLocalDeck,
  onLocalDbChange,
  importSampleDecks,
  type LocalDeck
} from "@/lib/client-db"
import { toast } from "sonner"
import type { Deck } from "@/types/deck"
import SearchAndFilter from "./SearchAndFilter"
import DeckGrid from "./DeckGrid"
import DeckList from "./DeckList"

interface DeckGalleryProps {
  initialDecks?: Deck[]
  lang: Lang
}

export default function DeckGallery({ lang }: DeckGalleryProps) {
  const t = useT()
  const [localDecks, setLocalDecks] = useState<LocalDeck[]>([])
  const [isLoadingSamples, setIsLoadingSamples] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [selectedSeries, setSelectedSeries] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [globalLimit, setGlobalLimit] = useState<number>(10)
  const [globalIsExamMode, setGlobalIsExamMode] = useState<boolean>(false)
  const isStale = searchQuery !== deferredSearchQuery
  const [isLoaded, setIsLoaded] = useState(false)

  const refreshDecks = useCallback(async () => {
    try {
      const items = await getLocalDecks()
      setLocalDecks(items)
    } catch (e) {
      console.warn("Failed to load decks", e)
    }
  }, [])

  // Delete Deck directly from IndexedDB
  const handleDeleteDeck = useCallback(async (deckId: string) => {
    if (!window.confirm(t.local.confirmDeleteDeck)) return
    try {
      const ok = await deleteLocalDeck(deckId)
      if (ok) {
        toast.success(t.local.deleteDeckSuccess)
        refreshDecks()
      } else {
        toast.error(t.local.deleteDeckFailed)
      }
    } catch {
      toast.error(t.local.deleteDeckFailed)
    }
  }, [t.local, refreshDecks])

  // Taste Sample Decks on-demand
  const handleTasteSampleDecks = async () => {
    setIsLoadingSamples(true)
    try {
      const result = await importSampleDecks()
      if (result.success && result.count > 0) {
        toast.success(t.home.sampleDecksAdded)
        refreshDecks()
      } else if (result.success && result.count === 0) {
        toast.info(t.home.sampleDecksAlreadyAdded)
      } else {
        toast.error(result.error || t.home.sampleDecksLoadFailed)
      }
    } catch {
      toast.error(t.home.sampleDecksLoadFailed)
    } finally {
      setIsLoadingSamples(false)
    }
  }

  // Load from IndexedDB on mount
  useEffect(() => {
    let isCancelled = false

    getLocalDecks()
      .then((items) => {
        if (!isCancelled) {
          setLocalDecks(items)
        }
      })
      .catch((e) => {
        console.warn("Failed to load local decks", e)
      })

    queueMicrotask(() => {
      if (isCancelled) return
      try {
        const savedLimit = localStorage.getItem('memorize_globalLimit')
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
    })

    const unsubscribe = onLocalDbChange((event) => {
      if (event === "deck_created" || event === "deck_deleted" || event === "backup_restored") {
        refreshDecks()
      }
    })

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [refreshDecks])

  // Save settings to localStorage
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem('memorize_globalLimit', globalLimit.toString())
      localStorage.setItem('memorize_viewMode', viewMode)
      localStorage.setItem('memorize_globalIsExamMode', globalIsExamMode.toString())
    } catch (e) {
      console.warn('Failed to save settings to local storage', e)
    }
  }, [globalLimit, viewMode, globalIsExamMode, isLoaded])

  const allDecks: Deck[] = useMemo(() => {
    return localDecks.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      type: d.type,
      series: d.series || null,
      _count: d._count,
      createdAt: d.createdAt,
      isLocal: true
    }))
  }, [localDecks])

  const uniqueSeries = useMemo(() => {
    const seriesSet = new Set<string>()
    allDecks.forEach((deck) => {
      if (deck.series) seriesSet.add(deck.series)
    })
    return Array.from(seriesSet).sort()
  }, [allDecks])

  const filteredDecks = useMemo(() => {
    return allDecks.filter((deck) => {
      const matchesSearch =
        deck.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        (deck.series && deck.series.toLowerCase().includes(deferredSearchQuery.toLowerCase()))
      const matchesSeries =
        selectedSeries === "all" ||
        (selectedSeries === "none" && !deck.series) ||
        deck.series === selectedSeries
      return matchesSearch && matchesSeries
    })
  }, [allDecks, deferredSearchQuery, selectedSeries])

  const sortSeries = useCallback((a: string, b: string) => {
    if (a === t.home.uncategorized) return 1
    if (b === t.home.uncategorized) return -1
    return a.localeCompare(b, undefined, { numeric: true })
  }, [t.home.uncategorized])

  const groupedDecks = useMemo(() => {
    const grouped = filteredDecks.reduce((acc, deck) => {
      const key = deck.series || t.home.uncategorized
      if (!acc[key]) acc[key] = []
      acc[key].push(deck)
      return acc
    }, {} as Record<string, typeof allDecks>)

    return Object.keys(grouped)
      .sort(sortSeries)
      .map((key) => {
        const sortedDecks = grouped[key].sort((a, b) => 
          a.title.localeCompare(b.title, undefined, { numeric: true })
        )
        return [key, sortedDecks] as [string, typeof allDecks]
      })
  }, [filteredDecks, sortSeries, t.home.uncategorized])

  // --- 1. Empty State (Onboarding Hero) ---
  if (allDecks.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative text-center p-8 sm:p-14 w-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* App Badge */}
            <div className="w-16 h-16 bg-linear-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/10">
              <Library size={28} aria-hidden="true" />
            </div>

            {/* Title & Desc */}
            <h3 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-300 mb-3 tracking-tight break-keep">
              {t.home.welcomeTitle}
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 mb-8 max-w-xl leading-relaxed break-keep">
              {t.home.welcomeDesc}
            </p>

            {/* 3-Step Visual Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8 text-left">
              {/* Step 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors relative overflow-hidden">
                <div className="text-xs font-mono font-bold text-indigo-400/80 mb-2">STEP 01</div>
                <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm mb-1.5">
                  <FileText size={16} className="text-indigo-400 shrink-0" />
                  <span>{t.home.step1Title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed break-keep">
                  {t.home.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors relative overflow-hidden">
                <div className="text-xs font-mono font-bold text-purple-400/80 mb-2">STEP 02</div>
                <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm mb-1.5">
                  <Sparkles size={16} className="text-purple-400 shrink-0" />
                  <span>{t.home.step2Title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed break-keep">
                  {t.home.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors relative overflow-hidden">
                <div className="text-xs font-mono font-bold text-emerald-400/80 mb-2">STEP 03</div>
                <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm mb-1.5">
                  <Brain size={16} className="text-emerald-400 shrink-0" />
                  <span>{t.home.step3Title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed break-keep">
                  {t.home.step3Desc}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href={`/${lang}/data-preparation`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <span>{t.home.goToDataPrep}</span>
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                onClick={handleTasteSampleDecks}
                disabled={isLoadingSamples}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 active:scale-95 transition-all"
              >
                <Sparkles size={15} className="text-indigo-400" />
                <span>
                  {isLoadingSamples ? t.home.loadingSamples : t.home.trySampleDecks}
                </span>
              </button>
            </div>

            {/* Secondary Navigation */}
            <div className="mt-5">
              <Link
                href={`/${lang}/data-management`}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
              >
                <FolderKanban size={13} />
                <span>{t.home.alreadyHaveJson}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 2. Active State (Deck List & Study Console) ---
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quick Action Navigation */}
      <div className="flex justify-between items-center w-full">
        <div className="text-sm font-semibold text-zinc-400">
          {t.management.totalDecks(allDecks.length)}
        </div>
        <Link
          href={`/${lang}/data-management`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 rounded-full transition-all duration-200"
        >
          <FolderKanban size={13} className="text-indigo-400" />
          <span>{t.home.manageDecks}</span>
          <ArrowRight size={12} />
        </Link>
      </div>

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
                  <DeckGrid
                    decks={seriesDecks}
                    lang={lang}
                    globalLimit={globalLimit}
                    globalIsExamMode={globalIsExamMode}
                    onDelete={handleDeleteDeck}
                  />
                ) : (
                  <DeckList
                    decks={seriesDecks}
                    lang={lang}
                    globalLimit={globalLimit}
                    globalIsExamMode={globalIsExamMode}
                    onDelete={handleDeleteDeck}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
