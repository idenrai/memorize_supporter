'use client'

import { Search, LayoutGrid, List as ListIcon } from "lucide-react"
import { useT } from "@/hooks/useT"
import CustomSelect from "../ui/CustomSelect"

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
  globalIsExamMode: boolean
  setGlobalIsExamMode: (isExam: boolean) => void
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
  setGlobalLimit,
  globalIsExamMode,
  setGlobalIsExamMode
}: SearchAndFilterProps) {
  const t = useT()

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Row 1: Search & Display Settings Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full">
        
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 w-4 h-4 pointer-events-none transition-colors" aria-hidden="true" />
          <input 
            type="text" 
            name="search"
            autoComplete="off"
            placeholder={t.home.searchDecks} 
            aria-label={t.home.searchDecks}
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-indigo-500/60 focus:bg-zinc-900 transition-colors duration-150 rounded-xl py-2 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>

        {/* Display Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 shrink-0">
          {/* Card Limit Select */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 rounded-xl px-3 py-1 border border-zinc-800 text-xs text-zinc-400">
            <span className="font-medium hidden sm:inline">{t.home.studyLimit}</span>
            <CustomSelect
              value={globalLimit}
              onChange={setGlobalLimit}
              ariaLabel={t.home.studyLimit}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
                { label: t.home.allCards, value: 0 }
              ]}
            />
          </div>

          {/* Global Exam Mode Toggle */}
          <div 
            role="group" 
            aria-label={`${t.home.practiceMode} / ${t.home.examMode}`}
            className="flex items-center bg-zinc-900/80 rounded-xl p-1 border border-zinc-800 shrink-0"
          >
            <button
              type="button"
              onClick={() => setGlobalIsExamMode(false)}
              aria-pressed={!globalIsExamMode}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                !globalIsExamMode 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.home.practiceMode}
            </button>
            <button
              type="button"
              onClick={() => setGlobalIsExamMode(true)}
              aria-pressed={globalIsExamMode}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                globalIsExamMode 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.home.examMode}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div 
            role="group" 
            aria-label={`${t.home.viewModeGrid} / ${t.home.viewModeList}`}
            className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title={t.home.viewModeGrid}
              aria-label={t.home.viewModeGrid}
              aria-pressed={viewMode === "grid"}
              className={`p-1.5 rounded-lg transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                viewMode === "grid" 
                  ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/80 shadow-xs' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              title={t.home.viewModeList}
              aria-label={t.home.viewModeList}
              aria-pressed={viewMode === "list"}
              className={`p-1.5 rounded-lg transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                viewMode === "list" 
                  ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/80 shadow-xs' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListIcon size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Series Tabs */}
      {uniqueSeries.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full border-b border-zinc-800/80 px-0.5">
          <button
            type="button"
            onClick={() => setSelectedSeries("all")}
            aria-pressed={selectedSeries === "all"}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              selectedSeries === "all" 
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
            }`}
          >
            {t.home.allSeries}
          </button>
          {uniqueSeries.map(series => (
            <button
              key={series}
              type="button"
              onClick={() => setSelectedSeries(series)}
              aria-pressed={selectedSeries === series}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                selectedSeries === series 
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
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

