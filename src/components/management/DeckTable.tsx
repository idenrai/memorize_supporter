'use client'

import { useState, useTransition, useMemo, useEffect, useCallback } from 'react'
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

  // Delete Deck
  const handleDelete = (id: string, title: string) => {
    if (!confirm(t.local.confirmDeleteDeckWithName(title))) return

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
      {/* Action Toolbar (Focused purely on deck collection management) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
        <div className="text-sm font-semibold text-zinc-300">
          {t.management.totalDecks(allDecks.length)}
        </div>

        <div className="flex items-center gap-2">
          {/* Add Sample Decks */}
          <button
            type="button"
            onClick={handleAddSampleDecks}
            disabled={isPending || isLoadingSamples}
            className="h-9 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all inline-flex items-center gap-1.5 shadow-md active:scale-95"
            title={t.management.addSampleDecks}
          >
            <Sparkles size={14} />
            <span>{isLoadingSamples ? t.home.loadingSamples : t.management.addSampleDecks}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative z-10 rounded-2xl border border-white/10 bg-zinc-950/50 shadow-inner overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th 
                  className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-white/10"
                  onClick={() => requestSort('title')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'title')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={`Sort by ${t.management.thName}`}
                >
                  {t.management.thName} {renderSortIcon('title')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-white/10"
                  onClick={() => requestSort('series')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'series')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'series' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={`Sort by ${t.management.thSeries}`}
                >
                  {t.management.thSeries} {renderSortIcon('series')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-white/10"
                  onClick={() => requestSort('type')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'type')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'type' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={`Sort by ${t.management.thType}`}
                >
                  {t.management.thType} {renderSortIcon('type')}
                </th>
                <th 
                  className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors whitespace-nowrap focus-visible:outline-hidden focus-visible:bg-white/10"
                  onClick={() => requestSort('cards')}
                  onKeyDown={(e) => handleSortKeyDown(e, 'cards')}
                  tabIndex={0}
                  aria-sort={sortConfig?.key === 'cards' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={`Sort by ${t.management.thCards}`}
                >
                  {t.management.thCards} {renderSortIcon('cards')}
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider select-none whitespace-nowrap">
                  {t.management.thActions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {sortedDecks.map((deck) => (
                <tr key={deck.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap max-w-37.5 sm:max-w-62.5 lg:max-w-xs">
                    <div title={deck.title}>
                      <div className="text-sm font-bold text-zinc-100 truncate">{deck.title}</div>
                      <div className="text-xs text-zinc-500 mt-1 font-mono truncate">{deck.id}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-300 max-w-30 sm:max-w-50 truncate" title={deck.series || ''}>
                    {deck.series || <span className="text-zinc-600 italic">-</span>}
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-400 capitalize">
                    {deck.type}
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-zinc-300 tabular-nums">
                    {deck._count?.cards ?? 0}
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(deck.id, deck.title)}
                        disabled={isPending}
                        className="text-red-400/70 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
                        title={t.management.delete}
                        aria-label={`${deck.title} ${t.management.delete}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedDecks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-zinc-500 text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderOpen size={36} className="text-zinc-600 mb-2 opacity-50" aria-hidden="true" />
                      <p className="text-zinc-200 font-bold text-base">{t.management.emptyDecksTitle}</p>
                      <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed break-keep">
                        {t.management.emptyDecksDesc}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile horizontal scroll affordance fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-zinc-950/80 to-transparent sm:hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
