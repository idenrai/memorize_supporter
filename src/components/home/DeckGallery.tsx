"use client"

import { useState, useMemo, useDeferredValue, useCallback, useEffect } from "react"
import Link from "next/link"
import { Search, ArrowRight, FolderKanban } from "lucide-react"
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
import DeckEmptyState from "./DeckEmptyState"
import ConfirmModal from "@/components/ui/ConfirmModal"

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
  const [deletingDeck, setDeletingDeck] = useState<{ id: string; title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const refreshDecks = useCallback(async () => {
    try {
      const items = await getLocalDecks()
      setLocalDecks(items)
    } catch (e) {
      console.warn("Failed to load decks", e)
    }
  }, [])

  // Request Deck deletion (open modal)
  const handleRequestDelete = useCallback((deckId: string) => {
    const deck = localDecks.find((d) => d.id === deckId)
    setDeletingDeck({ id: deckId, title: deck?.title || deckId })
  }, [localDecks])

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deletingDeck) return
    setIsDeleting(true)
    try {
      const ok = await deleteLocalDeck(deletingDeck.id)
      if (ok) {
        toast.success(t.local.deleteDeckSuccess)
        refreshDecks()
      } else {
        toast.error(t.local.deleteDeckFailed)
      }
    } catch {
      toast.error(t.local.deleteDeckFailed)
    } finally {
      setIsDeleting(false)
      setDeletingDeck(null)
    }
  }

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
      <DeckEmptyState
        lang={lang}
        isLoadingSamples={isLoadingSamples}
        onTasteSamples={handleTasteSampleDecks}
      />
    )
  }

  // --- 2. Active State (Deck List & Study Console) ---
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quick Action Navigation */}
      <div className="flex justify-between items-center w-full">
        <div className="text-xs sm:text-sm font-medium text-zinc-400">
          {t.management.totalDecks(allDecks.length)}
        </div>
        <Link
          href={`/${lang}/data-management`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
        >
          <FolderKanban size={13} className="text-indigo-400" aria-hidden="true" />
          <span>{t.home.manageDecks}</span>
          <ArrowRight size={12} aria-hidden="true" />
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
          <div className="text-center p-10 card-precision mt-2 w-full">
            <Search size={28} className="text-zinc-600 mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-zinc-300 mb-1">{t.home.noSearchResults}</h3>
          </div>
        ) : (
          <div className="flex flex-col gap-10 w-full">
            {groupedDecks.map(([seriesName, seriesDecks]) => (
              <div key={seriesName} className="mb-2">
                <div className="flex items-center gap-2 mb-5 border-b border-zinc-800/80 pb-2.5">
                  <h4 className="text-base sm:text-lg font-bold text-zinc-100">
                    {seriesName}
                  </h4>
                </div>
                
                {viewMode === "grid" ? (
                  <DeckGrid
                    decks={seriesDecks}
                    lang={lang}
                    globalLimit={globalLimit}
                    globalIsExamMode={globalIsExamMode}
                    onDelete={handleRequestDelete}
                  />
                ) : (
                  <DeckList
                    decks={seriesDecks}
                    lang={lang}
                    globalLimit={globalLimit}
                    globalIsExamMode={globalIsExamMode}
                    onDelete={handleRequestDelete}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Accessible Confirm Modal */}
      <ConfirmModal
        isOpen={deletingDeck !== null}
        title={t.management.confirmDeleteDeckTitle}
        description={
          deletingDeck
            ? t.management.confirmDeleteDeckDesc(deletingDeck.title)
            : ""
        }
        confirmText={t.management.confirmDeleteDeckButton}
        cancelText={t.management.cancel}
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDeck(null)}
      />
    </div>
  )
}
