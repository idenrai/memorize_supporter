'use client'

import { useState, useTransition, useMemo, useEffect, useCallback } from 'react'
import { Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { deleteLocalDeck, getLocalDecks, onLocalDbChange, type LocalDeck } from '@/lib/client-db'
import { useT } from '@/hooks/useT'
import { toast } from 'sonner'
import type { Deck } from '@/types/deck'

type SortKey = keyof Deck | 'cards' | 'source'

function getDeckSortValue(deck: Deck, key: SortKey): string | number {
  if (key === 'cards') return deck._count.cards
  if (key === 'source') return deck.isSystem ? 1 : 0
  if (key === 'createdAt') return new Date(deck.createdAt).getTime()
  if (key === 'isHidden') return deck.isHidden ? 1 : 0
  const val = deck[key]
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val
  return ''
}

export default function DeckTable({ staticDecks = [] }: { staticDecks?: { id: string; title: string; type: string; series?: string | null; _count: { cards: number }; createdAt?: Date }[] }) {
  const t = useT()
  const [isPending, startTransition] = useTransition()
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
  const [localDecks, setLocalDecks] = useState<LocalDeck[]>([])

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
        if (!isCancelled) setLocalDecks(items)
      })
      .catch((e) => {
        console.warn('Failed to load local decks', e)
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

  const handleDelete = (id: string) => {
    if (!confirm(t.management.confirmDelete)) return

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
    const systemItems: Deck[] = staticDecks.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      series: d.series || null,
      isSystem: true,
      isHidden: false,
      _count: d._count,
      createdAt: d.createdAt || new Date(0)
    }))

    const userItems: Deck[] = localDecks.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      series: d.series || null,
      isSystem: false,
      isHidden: false,
      _count: d._count,
      createdAt: d.createdAt
    }))

    return [...userItems, ...systemItems]
  }, [staticDecks, localDecks])

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
      ? <ChevronUp size={14} className="text-blue-400 inline-block ml-1" />
      : <ChevronDown size={14} className="text-blue-400 inline-block ml-1" />
  }

  const handleSortKeyDown = (e: React.KeyboardEvent, key: keyof Deck | 'cards' | 'source') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      requestSort(key)
    }
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/50 shadow-inner">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th 
              className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors focus-visible:outline-none focus-visible:bg-white/10"
              onClick={() => requestSort('title')}
              onKeyDown={(e) => handleSortKeyDown(e, 'title')}
              tabIndex={0}
              role="button"
              aria-label={`Sort by ${t.management.thName}`}
            >
              {t.management.thName} {renderSortIcon('title')}
            </th>
            <th 
              className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors focus-visible:outline-none focus-visible:bg-white/10"
              onClick={() => requestSort('series')}
              onKeyDown={(e) => handleSortKeyDown(e, 'series')}
              tabIndex={0}
              role="button"
              aria-label={`Sort by ${t.management.thSeries}`}
            >
              {t.management.thSeries} {renderSortIcon('series')}
            </th>
            <th 
              className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors focus-visible:outline-none focus-visible:bg-white/10"
              onClick={() => requestSort('type')}
              onKeyDown={(e) => handleSortKeyDown(e, 'type')}
              tabIndex={0}
              role="button"
              aria-label={`Sort by ${t.management.thType}`}
            >
              {t.management.thType} {renderSortIcon('type')}
            </th>
            <th 
              className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors focus-visible:outline-none focus-visible:bg-white/10"
              onClick={() => requestSort('cards')}
              onKeyDown={(e) => handleSortKeyDown(e, 'cards')}
              tabIndex={0}
              role="button"
              aria-label={`Sort by ${t.management.thCards}`}
            >
              {t.management.thCards} {renderSortIcon('cards')}
            </th>
            <th 
              className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none transition-colors focus-visible:outline-none focus-visible:bg-white/10"
              onClick={() => requestSort('source')}
              onKeyDown={(e) => handleSortKeyDown(e, 'source')}
              tabIndex={0}
              role="button"
              aria-label={`Sort by ${t.management.thSource}`}
            >
              {t.management.thSource} {renderSortIcon('source')}
            </th>
            <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider select-none">
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
                {deck._count.cards}
              </td>
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border ${
                  deck.isSystem 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {deck.isSystem ? t.management.sourceSystem : t.management.sourceUser}
                </span>
              </td>
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {!deck.isSystem && (
                    <button
                      onClick={() => handleDelete(deck.id)}
                      disabled={isPending}
                      className="text-red-400/70 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title={t.management.delete}
                      aria-label={t.management.delete}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {sortedDecks.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                {t.management.noDecks}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
