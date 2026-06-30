"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Layers } from "lucide-react"

interface DeckCardProps {
  deck: string
  deckName: string
  description?: string | null
  type?: string
  count: number
}

const typeConfig: Record<string, { label: string, color: string, bg: string }> = {
  practice_quiz: { label: 'Practice Quiz', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  flashcard: { label: 'Flashcards', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  vocabulary: { label: 'Vocabulary', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
}

export default function DeckCard({ deck, deckName, description, type = 'flashcard', count }: DeckCardProps) {
  const [limit, setLimit] = useState(20)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Determine available limits dynamically based on count
  const baseLimits = [10, 20, 50, 100]
  const limits = baseLimits.filter(l => l < count)
  limits.push(count) // Always add the exact total count as 'All'

  const config = typeConfig[type] || typeConfig['flashcard']

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="bg-[#1c1f26] border border-gray-800 rounded-2xl p-6 h-full flex flex-col hover:border-gray-700 hover:bg-[#232730] transition-all relative group">
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${config.bg.split(' ')[0]}`}></div>
      </div>
      
      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className={`text-xs font-semibold px-2 py-1 rounded-md border uppercase tracking-wider ${config.color} ${config.bg}`}>
            {config.label}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-[#1c1f26]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-800/50 shadow-sm">
            <Layers size={14} className="text-gray-500" />
            {count} <span className="font-normal text-gray-500 hidden sm:inline">Cards</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-2 mt-4">{deckName}</h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {description || `A collection of ${count} flashcards ready for active recall.`}
        </p>
      </div>

      <div className="flex items-center justify-end text-sm mt-auto relative z-10 pt-4 border-t border-gray-800/50">
        <div className="flex items-center bg-[#13151a] border border-gray-800 rounded-full p-1 shadow-sm relative">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-gray-200 transition-colors text-xs font-medium focus:outline-none whitespace-nowrap rounded-full hover:bg-white/5"
            >
              {limit === count ? 'All' : limit} Cards <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute bottom-full right-0 mb-3 bg-[#2a2f3a] border border-gray-700 rounded-xl shadow-2xl p-1.5 z-50 min-w-[110px] flex flex-col gap-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                {limits.map((l, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setLimit(l); setShowDropdown(false) }}
                    className={`px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                      limit === l 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {l === count ? 'All' : l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-gray-700 mx-1"></div>

          <Link 
            href={`/deck/${deck}?limit=${limit}`}
            className="flex items-center justify-center min-w-[70px] px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-blue-900/30"
          >
            Study
          </Link>
        </div>
      </div>
    </div>
  )
}
