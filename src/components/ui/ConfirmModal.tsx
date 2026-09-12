"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  cancelText: string
  isDestructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Store previously focused element to restore focus when modal closes
    if (document.activeElement instanceof HTMLElement) {
      previousActiveElementRef.current = document.activeElement
    }

    // Auto focus cancel button for safety after mount
    const rafId = requestAnimationFrame(() => {
      cancelButtonRef.current?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onCancel()
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
      cancelAnimationFrame(rafId)
      window.removeEventListener("keydown", handleKeyDown)
      // Return focus to previous trigger element if it still exists in DOM
      if (previousActiveElementRef.current && document.body.contains(previousActiveElementRef.current)) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto custom-scrollbar bg-zinc-900/95 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 z-10 animate-in zoom-in-95 duration-200 backdrop-blur-xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={cancelText}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          {/* Warning Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 flex items-center justify-center mb-4 shrink-0 shadow-inner">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>

          {/* Title */}
          <h3
            id="confirm-modal-title"
            className="text-lg sm:text-xl font-bold text-zinc-100 mb-2 tracking-tight break-keep"
          >
            {title}
          </h3>

          {/* Description */}
          <p
            id="confirm-modal-desc"
            className="text-sm text-zinc-400 leading-relaxed break-keep mb-6"
          >
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-10 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 border border-zinc-700/60 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-10 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full text-white transition-all shadow-md inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
                : "btn-indigo"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
