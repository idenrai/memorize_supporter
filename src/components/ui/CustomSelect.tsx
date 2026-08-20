"use client"

import { useState, useRef, useEffect, useCallback, KeyboardEvent as ReactKeyboardEvent, useId } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"

export interface SelectOption<T extends string | number> {
  label: string
  value: T
}

interface CustomSelectProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  className?: string
  dropdownClassName?: string
  trigger?: React.ReactNode
  ariaLabel?: string
}

export default function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  className = "",
  dropdownClassName = "",
  trigger,
  ariaLabel
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listboxId = useId()

  const searchStringRef = useRef("")
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const selectedOption = options.find((o) => o.value === value)

  const updatePopupPosition = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    // Estimate popup height (max-h-60 is ~240px, plus padding)
    const estimatedHeight = Math.min(options.length * 36 + 16, 240)
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    let top = rect.bottom + window.scrollY + 6
    // If not enough space below and there is more space above, flip it upwards
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      top = rect.top + window.scrollY - estimatedHeight - 6
    }

    const style: React.CSSProperties = {
      top: `${top}px`,
      minWidth: `${rect.width}px`
    }

    // Prevent horizontal overflow by anchoring to the right if on the right half of the screen
    if (rect.left > window.innerWidth / 2) {
      style.right = `${document.documentElement.clientWidth - rect.right - window.scrollX}px`
    } else {
      style.left = `${rect.left + window.scrollX}px`
    }

    setPopupStyle(style)
  }, [options.length])

  useEffect(() => {
    if (isOpen) {
      updatePopupPosition()
      window.addEventListener('scroll', updatePopupPosition, true)
      window.addEventListener('resize', updatePopupPosition)
    }
    
    return () => {
      window.removeEventListener('scroll', updatePopupPosition, true)
      window.removeEventListener('resize', updatePopupPosition)
    }
  }, [isOpen, updatePopupPosition])

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const el = listRef.current.children[focusedIndex] as HTMLElement
      if (el) {
        el.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [focusedIndex, isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return
      if (listRef.current?.parentElement?.contains(e.target as Node)) return
      
      setIsOpen(false)
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    // Type-ahead logic
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      const char = e.key.toLowerCase()
      searchStringRef.current += char
      
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => {
        searchStringRef.current = ""
      }, 500)

      const searchStr = searchStringRef.current
      const matchIndex = options.findIndex(o => o.label.toLowerCase().startsWith(searchStr))
      
      if (matchIndex >= 0) {
        if (!isOpen) {
          onChange(options[matchIndex].value)
        } else {
          setFocusedIndex(matchIndex)
        }
      }
      return
    }

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const currentIdx = options.findIndex(o => o.value === value)
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0)
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        containerRef.current?.querySelector('button')?.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange(options[focusedIndex].value)
          setIsOpen(false)
          containerRef.current?.querySelector('button')?.focus()
        }
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  const portalContent = isOpen && typeof document !== 'undefined' ? createPortal(
    <div 
      className={`absolute z-[100] rounded-xl border border-zinc-700 bg-zinc-800/95 backdrop-blur-xl shadow-xl overflow-hidden ${dropdownClassName}`}
      style={{
        ...popupStyle,
        animation: 'customSelectFadeIn 0.15s ease-out forwards'
      }}
    >
      <style>{`
        @keyframes customSelectFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <ul 
        id={listboxId}
        ref={listRef}
        className="max-h-60 overflow-auto p-1" 
        role="listbox"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value
          const isFocused = index === focusedIndex
          return (
            <li
              key={option.value.toString()}
              id={`${listboxId}-option-${option.value}`}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={(e) => {
                e.stopPropagation()
                onChange(option.value)
                setIsOpen(false)
                containerRef.current?.querySelector('button')?.focus()
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                isFocused ? (isSelected ? "bg-indigo-500/30 text-indigo-200" : "bg-zinc-700/80 text-white") 
                          : (isSelected ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-300")
              }`}
            >
              <span className="flex-1 truncate">{option.label}</span>
              {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
            </li>
          )
        })}
      </ul>
    </div>,
    document.body
  ) : null

  return (
    <div className="relative inline-block" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-owns={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? `${listboxId}-option-${options[focusedIndex].value}` : undefined}
        onClick={() => {
          if (!isOpen) {
            const currentIdx = options.findIndex(o => o.value === value)
            setFocusedIndex(currentIdx >= 0 ? currentIdx : 0)
            setIsOpen(true)
          } else {
            setIsOpen(false)
          }
        }}
        className={className || "flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 text-sm font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 py-1.5 pl-3 pr-2.5 rounded-xl transition-colors"}
      >
        {trigger ? trigger : (
          <>
            <span className="min-w-[1ch] text-left">{selectedOption?.label}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {portalContent}
    </div>
  )
}
