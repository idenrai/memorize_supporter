'use client'

import { Search, LayoutGrid, List as ListIcon } from "lucide-react"
import { useT } from "@/hooks/useT"

interface SearchAndFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedSeries: string
  setSelectedSeries: (series: string) => void
  uniqueSeries: string[]
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedSeries,
  setSelectedSeries,
  uniqueSeries,
  viewMode,
  setViewMode
}: SearchAndFilterProps) {
  const t = useT()

  return (
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
          className="relative z-10 w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 focus:border-indigo-500/50 transition-colors duration-300 rounded-2xl py-4 pl-14 pr-6 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-lg text-lg"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/30 p-2.5 rounded-2xl border border-white/5 backdrop-blur-sm">
        {uniqueSeries.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto px-1">
            <button
              onClick={() => setSelectedSeries("all")}
              aria-pressed={selectedSeries === "all"}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
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
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
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
            className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            title={t.home.viewModeList}
            aria-pressed={viewMode === "list"}
            className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "list" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <ListIcon size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
