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
  globalLimit: number
  setGlobalLimit: (limit: number) => void
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedSeries,
  setSelectedSeries,
  uniqueSeries,
  viewMode,
  setViewMode,
  globalLimit,
  setGlobalLimit
}: SearchAndFilterProps) {
  const t = useT()

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Search & Display Settings */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1 group">
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

        {/* Display Controls */}
        <div className="flex items-center justify-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-1.5 border border-zinc-800 shadow-inner px-3 h-[60px]">
            <span className="text-sm font-medium text-zinc-500 hidden sm:inline px-2">{t.home.studyLimit}</span>
            <select
              value={globalLimit}
              onChange={(e) => setGlobalLimit(Number(e.target.value))}
              className="bg-transparent text-base font-medium text-zinc-300 focus:outline-none focus:ring-0 py-2 cursor-pointer"
              aria-label={t.home.studyLimit}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>{t.home.allCards}</option>
            </select>
          </div>

          <div className="flex items-center bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-1.5 border border-zinc-800 shadow-inner h-[60px]">
            <button
              onClick={() => setViewMode("grid")}
              title={t.home.viewModeGrid}
              aria-pressed={viewMode === "grid"}
              className={`p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}
            >
              <LayoutGrid size={20} aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title={t.home.viewModeList}
              aria-pressed={viewMode === "list"}
              className={`p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${viewMode === "list" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}
            >
              <ListIcon size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Series Tabs */}
      {uniqueSeries.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none w-full border-b border-zinc-800/60 mb-2 px-1">
          <button
            onClick={() => setSelectedSeries("all")}
            aria-pressed={selectedSeries === "all"}
            className={`whitespace-nowrap px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 border-b-2 ${
              selectedSeries === "all" 
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" 
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            {t.home.allSeries}
          </button>
          {uniqueSeries.map(series => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              aria-pressed={selectedSeries === series}
              className={`whitespace-nowrap px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 border-b-2 ${
                selectedSeries === series 
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
