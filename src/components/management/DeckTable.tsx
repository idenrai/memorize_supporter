'use client'

import { useState, useTransition, useMemo, useEffect, useCallback, useRef } from 'react'
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Sparkles,
  FolderOpen
} from 'lucide-react'
import {
  deleteLocalDeck,
  getLocalDecks,
  onLocalDbChange,
  importSampleDecks,
  type LocalDeck
} from '@/lib/client-db'
import { useT } from '@/hooks/useT'
import { toast } from 'sonner'
import type { Deck } from '@/types/deck'
import ConfirmModal from '@/components/ui/ConfirmModal'

type SortKey = keyof Deck | 'cards'

function getDeckSortValue(deck: Deck, key: SortKey): string | number {
  if (key === 'cards') return deck._count?.cards ?? 0
  if (key === 'createdAt') return new Date(deck.createdAt).getTime()
  const val = deck[key]
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val
  return ''
}

export default function DeckTable() {
  const t = useT()
  const [isPending, startTransition] = useTransition()
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
  const [localDecks, setLocalDecks] = useState<LocalDeck[]>([])
  const [isLoadingSamples, setIsLoadingSamples] = useState(false)
  const [deletingDeck, setDeletingDeck] = useState<{ id: string; title: string } | null>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = useCallback(() => {
    const el = tableContainerRef.current
    if (!el) return
    const hasMoreRight = el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 12
    setCanScrollRight(hasMoreRight)
  }, [])

  const refreshLocalDecks = useCallback(async () => {
    try {
      const items = await getLocalDecks()
      setLocalDecks(items)
    } catch (e) {
      console.warn('Failed to load local decks', e)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    getLocalDecks()
      .then((items) => {
        if (!isCancelled) {
          setLocalDecks(items)
        }
      })
      .catch((e) => {
        console.warn('Failed to initialize decks in DeckTable', e)
      })

    const unsubscribe = onLocalDbChange((event) => {
      if (event === 'deck_created' || event === 'deck_deleted' || event === 'backup_restored') {
        refreshLocalDecks()
      }
    })
    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [refreshLocalDecks])

  // Add Sample Decks (Unique Action)
  const handleAddSampleDecks = async () => {
    setIsLoadingSamples(true)
    try {
      const result = await importSampleDecks()
      if (result.success && result.count > 0) {
        toast.success(t.management.sampleDecksAdded)
        refreshLocalDecks()
      } else if (result.success && result.count === 0) {
        toast.info(t.management.sampleDecksAlreadyAdded)
      } else {
        toast.error(result.error || t.management.sampleDecksLoadFailed)
      }
    } catch {
      toast.error(t.management.sampleDecksLoadFailed)
    } finally {
      setIsLoadingSamples(false)
    }
  }

  // Delete Deck Modal Controls
  const handleRequestDelete = (id: string, title: string) => {
    setDeletingDeck({ id, title })
  }

  const handleConfirmDelete = () => {
    if (!deletingDeck) return
    const { id } = deletingDeck

    startTransition(async () => {
      try {
        const ok = await deleteLocalDeck(id)
        if (ok) {
          toast.success(t.management.deleteSuccess)
          refreshLocalDecks()
        } else {
          toast.error(t.management.deleteFailed)
        }
      } catch {
        toast.error(t.common.error)
      } finally {
        setDeletingDeck(null)
      }
    })
  }

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

  const sortedDecks = useMemo(() => {
    const sortableItems = [...allDecks]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = getDeckSortValue(a, sortConfig.key)
        const bVal = getDeckSortValue(b, sortConfig.key)

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const comp = aVal.localeCompare(bVal)
          return sortConfig.direction === 'asc' ? comp : -comp
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [allDecks, sortConfig])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll, sortedDecks.length])

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ChevronsUpDown size={14} className="opacity-30 inline-block ml-1" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-indigo-400 inline-block ml-1" />
      : <ChevronDown size={14} className="text-indigo-400 inline-block ml-1" />
  }

  const handleSortKeyDown = (e: React.KeyboardEvent, key: SortKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      requestSort(key)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg text-zinc-300 bg-zinc-800 border border-zinc-700/60">
          {t.management.totalDecks(allDecks.length)}
        </span>

        <div className="flex items-center gap-2">
          {/* Add Sample Decks */}
          <button
            type="button"
            onClick={handleAddSampleDecks}
            disabled={isPending || isLoadingSamples}
            className="btn-primary h-8 px-3 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 disabled:opacity-50"
            title={t.management.addSampleDecks}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>{isLoadingSamples ? t.home.loadingSamples : t.management.addSampleDecks}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden shadow-xs">
        {/* Mobile Horizontal Scroll Indicator (Visual Cue) */}
        <div
          className={`pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-zinc-950/90 to-transparent md:hidden z-20 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <div
          ref={tableContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto custom-scrollbar"
        >
          <table className="min-w-[540px] w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900/80">
              <tr>
                <th 
                  className="px-4 py-3 sm:px-5 sm:py-3.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/60 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-zinc-800"
                  onClick={() => requestSort('title')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'title')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={t.management.sortBy(t.management.thName)}
                >
                  {t.management.thName} {renderSortIcon('title')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-5 sm:py-3.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/60 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-zinc-800"
                  onClick={() => requestSort('series')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'series')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'series' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={t.management.sortBy(t.management.thSeries)}
                >
                  {t.management.thSeries} {renderSortIcon('series')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-5 sm:py-3.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/60 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-zinc-800"
                  onClick={() => requestSort('type')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'type')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'type' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={t.management.sortBy(t.management.thType)}
                >
                  {t.management.thType} {renderSortIcon('type')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-5 sm:py-3.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/60 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-zinc-800"
                  onClick={() => requestSort('cards')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'cards')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'cards' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={t.management.sortBy(t.management.thCards)}
                >
                  {t.management.thCards} {renderSortIcon('cards')}
                </th>
                <th className="px-4 py-3 sm:px-5 sm:py-3.5 text-right text-2xs font-semibold text-zinc-400 uppercase tracking-wider select-none whitespace-nowrap">
                  {t.management.thActions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-transparent">
              {sortedDecks.map((deck) => (
                <tr key={deck.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap max-w-37.5 sm:max-w-62.5 lg:max-w-xs">
                    <div title={deck.title}>
                      <div className="text-sm font-semibold text-zinc-100 truncate">{deck.title}</div>
                      <div className="text-2xs text-zinc-500 mt-0.5 font-mono truncate">{deck.id}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap text-xs text-zinc-300 max-w-30 sm:max-w-50 truncate" title={deck.series || ''}>
                    {deck.series || <span className="text-zinc-600 italic">-</span>}
                  </td>
                  <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap text-xs text-zinc-400 capitalize">
                    <span className="px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-800 text-zinc-300 text-2xs font-medium">
                      {deck.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap text-xs font-medium text-zinc-300 tabular-nums">
                    {deck._count?.cards ?? 0}
                  </td>
                  <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap text-right text-xs font-medium">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleRequestDelete(deck.id, deck.title)}
                        disabled={isPending}
                        className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500"
                        title={t.management.delete}
                        aria-label={`${deck.title} ${t.management.delete}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedDecks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderOpen size={32} className="text-zinc-600 mb-1 opacity-60" aria-hidden="true" />
                      <p className="text-zinc-200 font-bold text-sm">{t.management.emptyDecksTitle}</p>
                      <p className="text-zinc-400 text-xs max-w-md leading-relaxed break-keep font-normal">
                        {t.management.emptyDecksDesc}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        isLoading={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDeck(null)}
      />
    </div>
  )
}
