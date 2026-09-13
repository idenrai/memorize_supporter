'use client'

import { useState } from 'react'
import { Copy, Check, Download, Terminal, FileCode } from 'lucide-react'
import type { TemplateData } from '@/types/preparation'
import { useT } from '@/hooks/useT'
import { toast } from 'sonner'

export default function DataPreparationClient({ templates }: { templates: TemplateData[] }) {
  const t = useT()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(templates[0] || null)
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt')
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)

  const handleCopyPrompt = async () => {
    if (!selectedTemplate) return
    try {
      const promptText = t.prep.promptFormat(selectedTemplate.content)
      await navigator.clipboard.writeText(promptText)
      setCopiedPrompt(true)
      toast.success(t.prep.promptCopied)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch {
      toast.error(t.prep.promptCopyFailed)
    }
  }

  const handleCopyJson = async () => {
    if (!selectedTemplate) return
    try {
      await navigator.clipboard.writeText(selectedTemplate.content)
      setCopiedJson(true)
      toast.success(t.prep.jsonCopied)
      setTimeout(() => setCopiedJson(false), 2000)
    } catch {
      toast.error(t.prep.jsonCopyFailed)
    }
  }

  const handleDownloadJson = () => {
    if (!selectedTemplate) return
    try {
      const blob = new Blob([selectedTemplate.content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `_template_${selectedTemplate.id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t.common.error)
    }
  }


  const getTemplateFields = (id: string) => {
    if (id === 'flashcards') return t.prep.fieldsFlashcard
    if (id === 'practice_quiz') return t.prep.fieldsQuiz
    return t.prep.fieldsVocab
  }

  return (
    <div className="card-precision p-6 md:p-8">
      {/* 1. Template Selector Grid */}
      <div className="mb-8">
        <label className="block text-2xs font-bold text-zinc-400 mb-3 tracking-widest uppercase">
          {t.prep.selectTemplate}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {templates.map(template => {
            const isSelected = selectedTemplate?.id === template.id
            const fieldsPreview = getTemplateFields(template.id)
            return (
              <button
                key={template.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 sm:p-5 rounded-xl text-left transition-all duration-150 border cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500/80 bg-zinc-900 shadow-xs ring-1 ring-indigo-500/30'
                    : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div>
                  <span className="block text-xs sm:text-sm font-semibold text-zinc-100 mb-1.5 whitespace-nowrap tracking-tight">
                    {template.name}
                  </span>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal mb-3 min-h-10">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/60 flex flex-wrap items-center gap-1 font-mono">
                  {fieldsPreview.split(' · ').map((field) => (
                    <span
                      key={field}
                      className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-400 text-3xs"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Precision Code & Prompt Inspector */}
      {selectedTemplate && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
          {/* Header Bar with Tabs and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'prompt'
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal size={13} aria-hidden="true" />
                <span>{t.prep.tabPrompt}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileCode size={13} aria-hidden="true" />
                <span>{t.prep.tabJson}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab === 'prompt' ? (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-colors text-xs font-semibold shadow-xs ${
                    copiedPrompt
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'btn-primary'
                  }`}
                >
                  {copiedPrompt ? <Check size={14} className="text-emerald-400" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copiedPrompt ? t.prep.copied : t.prep.copyPrompt}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors text-xs font-semibold shadow-xs ${
                      copiedJson
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'btn-secondary'
                    }`}
                  >
                    {copiedJson ? <Check size={13} className="text-emerald-400" aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    <span>{copiedJson ? t.prep.copied : t.prep.copyJson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <Download size={13} aria-hidden="true" />
                    <span>{t.prep.downloadJson}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Terminal Container */}
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner">
            {/* Terminal Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-2xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-700" aria-hidden="true" />
                <span className="font-mono text-zinc-300 font-medium">
                  {activeTab === 'prompt'
                    ? `system_prompt_${selectedTemplate.id}.txt`
                    : `_template_${selectedTemplate.id}.json`}
                </span>
              </div>
              <span className="text-3xs font-mono uppercase text-zinc-500">
                {activeTab === 'prompt' ? t.prep.terminalLabelPrompt : t.prep.terminalLabelJson}
              </span>
            </div>

            {/* Code Content Area */}
            <textarea
              readOnly
              aria-label={activeTab === 'prompt' ? t.prep.aiPrompt : t.prep.tabJson}
              value={
                activeTab === 'prompt'
                  ? t.prep.promptFormat(selectedTemplate.content)
                  : selectedTemplate.content
              }
              className="w-full h-84 p-5 sm:p-6 bg-transparent text-xs text-zinc-300 font-mono resize-none focus:outline-hidden custom-scrollbar leading-relaxed selection:bg-indigo-500/30"
            />
          </div>
        </div>
      )}
    </div>
  )
}
