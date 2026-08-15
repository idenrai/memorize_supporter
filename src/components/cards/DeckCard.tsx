"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Layers } from "lucide-react"
import { useT } from "@/hooks/useT"

interface DeckCardProps {
  deck: string
  deckName: string
  description?: string | null
  type?: string
  count: number
  lang: string
}

const typeConfig: Record<string, { label: string, color: string, bg: string }> = {
  practice_quiz: { label: 'Practice Quiz', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  flashcard: { label: 'Flashcards', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  vocabulary: { label: 'Vocabulary', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
}

export default function DeckCard({ deck, deckName, description, type = 'flashcard', count, lang }: DeckCardProps) {
  const t = useT()
  const [limit, setLimit] = useState(Math.min(10, count))
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
    <div className="group relative h-full flex flex-col rounded-3xl p-[1px] overflow-hidden hover-glow-indigo">
      {/* Animated gradient border background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-teal-500/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-md`} />
      
      {/* Inner Card Content */}
      <div className="relative h-full flex flex-col bg-zinc-950/90 backdrop-blur-xl rounded-[23px] p-6 border border-white/5">
        <div className="absolute inset-0 overflow-hidden rounded-[23px] pointer-events-none z-0">
          <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${config.bg.split(' ')[0]}`}></div>
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${config.color} bg-white/5 border border-white/10 shadow-inner backdrop-blur-md`}>
              {type === 'practice_quiz' ? t.quiz.practiceQuiz : type === 'vocabulary' ? t.quiz.vocabulary : t.quiz.flashcard}
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-inner">
              <Layers size={14} className="text-blue-400" aria-hidden="true" />
              {count} <span className="font-medium text-zinc-500 hidden sm:inline">{t.home.cards}</span>
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 mb-2 mt-4 line-clamp-2 leading-tight group-hover:from-white group-hover:to-zinc-200 transition-colors">
            {deckName}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-medium">
            {description || t.home.defaultDesc(count)}
          </p>
        </div>

      <div className="flex items-center justify-end text-sm mt-auto relative z-10 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-1 shadow-sm relative">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown) }}
              aria-expanded={showDropdown}
              aria-haspopup="true"
              className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 whitespace-nowrap rounded-full hover:bg-white/5"
            >
              {limit === count ? t.home.allCards : `${limit} ${t.home.cards}`} <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            
            {showDropdown && (
              <div className="absolute bottom-full right-0 mb-3 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-1.5 z-50 min-w-[110px] flex flex-col gap-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                {limits.map((l, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setLimit(l); setShowDropdown(false) }}
                    className={`px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                      limit === l 
                        ? 'bg-teal-500/20 text-teal-400 font-medium' 
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {l === count ? t.home.allCards : l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-zinc-700 mx-1"></div>

          <Link 
            href={`/${lang}/deck/${deck}?limit=${limit}`}
            className="min-w-[70px] px-4 py-1.5 rounded-full text-xs uppercase tracking-wider btn-indigo"
          >
            {t.common.study}
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
