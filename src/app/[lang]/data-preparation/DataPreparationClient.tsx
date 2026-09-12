'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { TemplateData } from './page'
import { useT } from '@/hooks/useT'
import { toast } from 'sonner'

export default function DataPreparationClient({ templates }: { templates: TemplateData[] }) {
  const t = useT()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(templates[0] || null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!selectedTemplate) return
    try {
      const promptText = t.prep.promptFormat(selectedTemplate.content)
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      toast.success(t.prep.promptCopied)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t.prep.promptCopyFailed)
    }
  }

  return (
    <div className="relative glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 mb-8">
        <label className="block text-xs font-bold text-zinc-400 mb-4 tracking-widest uppercase">
          {t.prep.selectTemplate}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map(template => {
            const isSelected = selectedTemplate?.id === template.id
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template)}
                className={`relative p-5 rounded-2xl text-left transition-[background-color,border-color,box-shadow,transform] duration-200 border cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/40'
                    : 'border-white/10 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-2xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-inner ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 text-zinc-400 border-white/10'
                    }`}
                  >
                    {template.name}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                  {template.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedTemplate && (
        <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-linear-to-b from-indigo-400 to-teal-400 rounded-full" aria-hidden="true" />
              <span>{t.prep.aiPrompt}</span>
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-xs sm:text-sm font-bold shadow-sm ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'btn-indigo'
              }`}
            >
              {copied ? <Check size={15} className="text-emerald-400" aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              <span>{copied ? t.prep.copied : t.prep.copyPrompt}</span>
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/90 shadow-inner group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500/50 via-teal-500/50 to-purple-500/50 opacity-50" />
            <textarea
              readOnly
              aria-label={t.prep.aiPrompt}
              value={t.prep.promptFormat(selectedTemplate.content)}
              className="w-full h-80 p-5 sm:p-6 bg-transparent text-xs sm:text-sm text-zinc-300 font-mono resize-none focus:outline-hidden custom-scrollbar leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  )
}
