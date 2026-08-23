'use client'

import { useState, useTransition, useMemo } from 'react'
import { Eye, EyeOff, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Check, X } from 'lucide-react'
import { toggleDeckVisibility, deleteDeck, updateDeckDetails } from '@/actions/deck'
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

export default function DeckTable({ initialDecks }: { initialDecks: Deck[] }) {
  const t = useT()
  const [isPending, startTransition] = useTransition()
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ title: string; series: string }>({ title: '', series: '' })

  const handleToggle = (id: string, currentHidden: boolean) => {
    startTransition(async () => {
      try {
        await toggleDeckVisibility({ deckId: id, currentHidden })
        toast.success(currentHidden ? t.management.visible : t.management.hidden)
      } catch {
        toast.error(t.common.error)
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm(t.management.confirmDelete)) return

    startTransition(async () => {
      try {
        const result = await deleteDeck({ deckId: id })
        if (!result.success) {
          toast.error(t.management.deleteFailed)
        } else {
          toast.success(t.management.deleteSuccess)
        }
      } catch {
        toast.error(t.common.error)
      }
    })
  }

  const startEdit = (deck: Deck) => {
    setEditingId(deck.id)
    setEditForm({ title: deck.title, series: deck.series || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = (id: string) => {
    if (!editForm.title.trim()) {
      toast.error(t.common.error) // Title is required
      return
    }
    startTransition(async () => {
      try {
        const result = await updateDeckDetails({ 
          deckId: id, 
          title: editForm.title, 
          series: editForm.series 
        })
        if (result.success) {
          toast.success(t.management.editSuccess)
          setEditingId(null)
        } else {
          toast.error(t.management.editFailed)
        }
      } catch {
        toast.error(t.common.error)
      }
    })
  }

  const sortedDecks = useMemo(() => {
    const sortableItems = [...initialDecks]
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
  }, [initialDecks, sortConfig])

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
  };

  const handleSortKeyDown = (e: React.KeyboardEvent, key: keyof Deck | 'cards' | 'source') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      requestSort(key);
    }
  };

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
            <tr key={deck.id} className={`hover:bg-white/5 transition-colors ${deck.isHidden && editingId !== deck.id ? 'opacity-40 grayscale' : ''}`}>
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap max-w-37.5 sm:max-w-62.5 lg:max-w-xs">
                {editingId === deck.id ? (
                  <input 
                    type="text" 
                    value={editForm.title} 
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(deck.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    aria-label={t.management.thName}
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm font-bold text-zinc-100 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isPending}
                  />
                ) : (
                  <div title={deck.title}>
                    <div className="text-sm font-bold text-zinc-100 truncate">{deck.title}</div>
                    <div className="text-xs text-zinc-500 mt-1 font-mono truncate">{deck.id}</div>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-300 max-w-30 sm:max-w-50 truncate" title={deck.series || ''}>
                {editingId === deck.id ? (
                  <input 
                    type="text" 
                    value={editForm.series} 
                    onChange={(e) => setEditForm({ ...editForm, series: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(deck.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    aria-label={t.management.thSeries}
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder={t.management.optional}
                    disabled={isPending}
                  />
                ) : (
                  deck.series || <span className="text-zinc-600 italic">-</span>
                )}
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
                  {editingId === deck.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(deck.id)}
                        disabled={isPending}
                        className="text-green-400 p-2 rounded-lg hover:bg-green-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        title={t.management.save}
                        aria-label={t.management.save}
                      >
                        <Check size={18} aria-hidden="true" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isPending}
                        className="text-zinc-400 p-2 rounded-lg hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                        title={t.management.cancel}
                        aria-label={t.management.cancel}
                      >
                        <X size={18} aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(deck.id, deck.isHidden)}
                        disabled={isPending}
                        className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                          deck.isHidden 
                            ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' 
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                        }`}
                        title={deck.isHidden ? t.management.visible : t.management.hidden}
                        aria-label={deck.isHidden ? t.management.visible : t.management.hidden}
                      >
                        {deck.isHidden ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </button>
                      {!deck.isSystem && (
                        <>
                          <button
                            onClick={() => startEdit(deck)}
                            disabled={isPending}
                            className="text-blue-400/70 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            title={t.management.edit}
                            aria-label={t.management.edit}
                          >
                            <Pencil size={18} aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(deck.id)}
                            disabled={isPending}
                            className="text-red-400/70 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            title={t.management.delete}
                            aria-label={t.management.delete}
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </>
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
