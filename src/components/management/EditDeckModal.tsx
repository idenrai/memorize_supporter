"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useT } from "@/hooks/useT"
import { toast } from "sonner"

interface EditDeckModalProps {
  isOpen: boolean
  deck: { id: string; title: string; series: string | null } | null
  isLoading?: boolean
  onSave: (updates: { title: string; series: string | null }) => Promise<void>
  onClose: () => void
}

export default function EditDeckModal({
  isOpen,
  deck,
  isLoading = false,
  onSave,
  onClose,
}: EditDeckModalProps) {
  const t = useT()
  const [title, setTitle] = useState(deck?.title ?? "")
  const [series, setSeries] = useState(deck?.series || "")

  const modalRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (document.activeElement instanceof HTMLElement) {
        previousActiveElementRef.current = document.activeElement
      }

      const rafId = requestAnimationFrame(() => {
        titleInputRef.current?.focus()
        titleInputRef.current?.select()
      })

      return () => cancelAnimationFrame(rafId)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const focusable = Array.from(focusableElements)
        if (focusable.length === 0) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (previousActiveElementRef.current && document.body.contains(previousActiveElementRef.current)) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !deck) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error(t.management.deckTitleRequired)
      titleInputRef.current?.focus()
      return
    }

    const trimmedSeries = series.trim() || null
    await onSave({ title: trimmedTitle, series: trimmedSeries })
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing) {
      e.preventDefault()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-deck-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={t.management.cancel}
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="mb-6">
          <h3
            id="edit-deck-modal-title"
            className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight break-keep"
          >
            {t.management.editDeck}
          </h3>
          <p className="text-2xs font-mono text-zinc-500 mt-1 truncate">
            {deck.id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Deck Title Input */}
          <div>
            <label
              htmlFor="edit-deck-title-input"
              className="block text-xs font-semibold text-zinc-300 mb-1.5"
            >
              {t.management.editDeckTitle}
              <span className="text-rose-400 ml-1" aria-hidden="true">*</span>
            </label>
            <input
              id="edit-deck-title-input"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
              maxLength={150}
              className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Deck Series/Category Input */}
          <div>
            <label
              htmlFor="edit-deck-series-input"
              className="block text-xs font-semibold text-zinc-300 mb-1.5"
            >
              {t.management.editDeckSeries}
            </label>
            <input
              id="edit-deck-series-input"
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
              placeholder={t.management.editDeckSeriesPlaceholder}
              maxLength={80}
              className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4 border-t border-zinc-800/80 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary h-9 px-4 text-xs font-semibold rounded-xl disabled:opacity-50 inline-flex items-center justify-center"
            >
              {t.management.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-9 px-5 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              )}
              <span>{t.management.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
