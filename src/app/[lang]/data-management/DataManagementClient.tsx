'use client'

import { useState, useRef, useTransition, useMemo } from 'react'
import { Eye, EyeOff, Trash2, Upload, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Check, X } from 'lucide-react'
import { uploadDeck, toggleDeckVisibility, deleteDeck, updateDeckDetails } from '@/actions/deck'
import { useT } from '@/hooks/useT'
import type { Lang } from '@/i18n/types'

type Deck = {
  id: string
  title: string
  type: string
  series: string | null
  isSystem: boolean
  isHidden: boolean
  _count: { cards: number }
  createdAt: Date
}

export default function DataManagementClient({ initialDecks, lang }: { initialDecks: Deck[], lang: Lang }) {
  const t = useT()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deck | 'cards' | 'source'; direction: 'asc' | 'desc' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ title: string; series: string }>({ title: '', series: '' })

  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File) => {
    setErrorMsg(null)
    setSuccessMsg(null)

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(t.management.uploadSizeLimitError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      
      startTransition(async () => {
        const result = await uploadDeck(content, file.name)
        if (result.success) {
          setSuccessMsg(t.management.uploadSuccess)
          if (fileInputRef.current) fileInputRef.current.value = ''
        } else {
          setErrorMsg(t.management.uploadFailed)
        }
      })
    }
    reader.onerror = () => {
      setErrorMsg(t.common.error)
    }
    reader.readAsText(file)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.json')) {
      processFile(file)
    } else if (file) {
      setErrorMsg(t.management.uploadFailed) // Or specific "JSON only" error
    }
  }



  const handleToggle = (id: string, currentHidden: boolean) => {
    startTransition(async () => {
      await toggleDeckVisibility(id, currentHidden)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm(t.management.confirmDelete)) return

    startTransition(async () => {
      const result = await deleteDeck(id)
      if (!result.success) {
        setErrorMsg(t.management.deleteFailed)
      } else {
        setSuccessMsg(t.management.deleteSuccess)
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
      setErrorMsg(t.common.error) // Title is required
      return
    }
    startTransition(async () => {
      const result = await updateDeckDetails(id, editForm)
      if (result.success) {
        setSuccessMsg(t.management.editSuccess)
        setEditingId(null)
      } else {
        setErrorMsg(t.management.editFailed)
      }
    })
  }

  const sortedDecks = useMemo(() => {
    let sortableItems = [...initialDecks];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        if (sortConfig.key === 'cards') {
          aValue = a._count.cards;
          bValue = b._count.cards;
        } else if (sortConfig.key === 'source') {
          aValue = a.isSystem ? 1 : 0;
          bValue = b.isSystem ? 1 : 0;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        if (aValue === null) aValue = '';
        if (bValue === null) bValue = '';
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comp = aValue.localeCompare(bValue);
          if (comp !== 0) {
            return sortConfig.direction === 'asc' ? comp : -comp;
          }
        } else {
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [initialDecks, sortConfig]);

  const requestSort = (key: keyof Deck | 'cards' | 'source') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      
      {/* Upload Section */}
      <div 
        className={`relative z-10 mb-10 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 text-center group ${
          isDragging 
            ? 'bg-indigo-500/10 border-indigo-400 scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.3)] ring-4 ring-indigo-500/20' 
            : 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload aria-hidden="true" className={`mx-auto h-12 w-12 mb-4 transition-all duration-300 ${isDragging ? 'text-indigo-400 scale-125 animate-bounce' : 'text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110'}`} />
        <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.management.uploadData}</h3>
        <p className="text-sm text-zinc-400 mb-6 text-balance">
          {t.management.selectJsonFile}
        </p>
        <div>
          <label className="cursor-pointer px-6 py-2.5 rounded-full text-base btn-indigo">
            {isPending ? t.management.uploading : t.management.chooseFile}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isPending}
            />
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="relative z-10 mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}
      
      {successMsg && (
        <div className="relative z-10 mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Table Section */}
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
                aria-label="Sort by Source"
              >
                Source {renderSortIcon('source')}
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider select-none">
                {t.management.thActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {sortedDecks.map((deck) => (
              <tr key={deck.id} className={`hover:bg-white/5 transition-colors ${deck.isHidden && editingId !== deck.id ? 'opacity-40 grayscale' : ''}`}>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap max-w-[150px] sm:max-w-[250px] lg:max-w-xs">
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
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-300 max-w-[120px] sm:max-w-[200px] truncate" title={deck.series || ''}>
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
                      placeholder="Optional"
                      disabled={isPending}
                    />
                  ) : (
                    deck.series || <span className="text-zinc-600 italic">-</span>
                  )}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-400 capitalize">
                  {deck.type}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-zinc-300">
                  {deck._count.cards}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border ${
                    deck.isSystem 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {deck.isSystem ? 'System' : 'User'}
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
                        >
                          <Check size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={isPending}
                          className="text-zinc-400 p-2 rounded-lg hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                          title={t.management.cancel}
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
                            >
                              <Pencil size={18} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDelete(deck.id)}
                              disabled={isPending}
                              className="text-red-400/70 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                              title="Delete"
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
                  No decks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
