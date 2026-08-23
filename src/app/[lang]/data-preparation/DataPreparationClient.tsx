'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { TemplateData } from './page'
import { useT } from '@/hooks/useT'

export default function DataPreparationClient({ templates }: { templates: TemplateData[] }) {
  const t = useT()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(templates[0] || null)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!selectedTemplate) return
    const promptText = t.prep.promptFormat(selectedTemplate.content)
    navigator.clipboard.writeText(promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-950/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 mb-8">
        <label className="block text-sm font-bold text-zinc-300 mb-4 tracking-wide uppercase">
          {t.prep.selectTemplate}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`relative p-5 rounded-2xl text-left transition-colors duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-zinc-600 hover:bg-white/10'
              }`}
            >
              <div className={`font-bold text-base ${selectedTemplate?.id === template.id ? 'text-blue-400' : 'text-zinc-200'}`}>
                {template.name}
              </div>
              <div className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="relative z-10 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              {t.prep.aiPrompt}
            </h3>
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors text-sm font-bold ${
                copied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 hover:border-white/20'
              }`}
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              <span>{copied ? t.prep.copied : t.prep.copyPrompt}</span>
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-inner group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500/50 via-purple-500/50 to-teal-500/50 opacity-50" />
            <textarea
              readOnly
              value={t.prep.promptFormat(selectedTemplate.content)}
              className="w-full h-80 p-6 bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none custom-scrollbar"
            />
          </div>
        </div>
      )}
    </div>
  )
}
