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
    <div className="flex flex-col gap-6">
      {/* Row 1: Search & Display Settings */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1 group">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-blue-500/10 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-400 group-focus-within:animate-pulse motion-reduce:animate-none w-5 h-5 pointer-events-none z-20 transition-colors" aria-hidden="true" />
          <input 
            type="text" 
            name="search"
            autoComplete="off"
            placeholder={t.home.searchDecks} 
            aria-label={t.home.searchDecks}
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative z-10 w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 focus:border-indigo-500/50 transition-colors duration-300 rounded-2xl py-3.5 pl-14 pr-6 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-lg text-base"
          />
        </div>

        {/* Display Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
          {/* Card Limit Select */}
          <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-1.5 border border-zinc-800/80 shadow-inner px-4 h-13 hover:border-zinc-700 transition-colors shrink-0">
            <span className="text-sm font-medium text-zinc-500 hidden sm:inline">{t.home.studyLimit}</span>
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
            className="hidden sm:flex items-center bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-1.5 border border-zinc-800/80 shadow-inner h-13 shrink-0"
          >
            <button
              onClick={() => setGlobalIsExamMode(false)}
              aria-pressed={!globalIsExamMode}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                !globalIsExamMode 
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {t.home.practiceMode}
            </button>
            <button
              onClick={() => setGlobalIsExamMode(true)}
              aria-pressed={globalIsExamMode}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                globalIsExamMode 
                  ? 'bg-purple-600/90 text-white shadow-sm ring-1 ring-purple-500/50' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {t.home.examMode}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div 
            role="group" 
            aria-label={`${t.home.viewModeGrid} / ${t.home.viewModeList}`}
            className="flex bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-zinc-800/80 shadow-inner h-13 shrink-0"
          >
            <button
              onClick={() => setViewMode("grid")}
              title={t.home.viewModeGrid}
              aria-label={t.home.viewModeGrid}
              aria-pressed={viewMode === "grid"}
              className={`p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                viewMode === "grid" 
                  ? 'bg-zinc-800 text-indigo-400 shadow-sm ring-1 ring-white/5' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <LayoutGrid size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title={t.home.viewModeList}
              aria-label={t.home.viewModeList}
              aria-pressed={viewMode === "list"}
              className={`p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                viewMode === "list" 
                  ? 'bg-zinc-800 text-indigo-400 shadow-sm ring-1 ring-white/5' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <ListIcon size={18} aria-hidden="true" />
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
            className={`whitespace-nowrap px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 border-b-2 ${
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
              className={`whitespace-nowrap px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 border-b-2 ${
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
