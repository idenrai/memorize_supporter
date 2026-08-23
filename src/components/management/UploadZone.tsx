'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload } from 'lucide-react'
import { uploadDeck } from '@/actions/deck'
import { useT } from '@/hooks/useT'
import { toast } from 'sonner'

export default function UploadZone() {
  const t = useT()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File) => {
    const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB || '5', 10) * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t.management.uploadSizeLimitError)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      
      startTransition(async () => {
        try {
          const result = await uploadDeck({ jsonData: content, fileName: file.name })
          if (result.success) {
            toast.success(t.management.uploadSuccess)
            if (fileInputRef.current) fileInputRef.current.value = ''
          } else {
            toast.error(t.management.uploadFailed)
          }
        } catch {
          toast.error(t.common.error)
        }
      })
    }
    reader.onerror = () => {
      toast.error(t.common.error)
    }
    reader.readAsText(file)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.json')) {
      processFile(file)
    } else if (file) {
      toast.error(t.management.uploadFailed) // JSON 파일 아님
    }
  }

  return (
    <div 
      className={`relative z-10 mb-10 p-8 rounded-2xl border-2 border-dashed transition-colors duration-300 text-center group ${
        isDragging 
          ? 'bg-indigo-500/10 border-indigo-400 scale-102 shadow-glow-indigo ring-4 ring-indigo-500/20' 
          : 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload aria-hidden="true" className={`mx-auto h-12 w-12 mb-4 transition-transform duration-300 ${isDragging ? 'text-indigo-400 scale-125 animate-bounce' : 'text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110'}`} />
      <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.management.uploadData}</h3>
      <p className="text-sm text-zinc-400 mb-6 text-balance">
        {t.management.selectJsonFile}
      </p>
      <div>
        <label className="cursor-pointer px-6 py-2.5 rounded-full text-base btn-indigo">
          {isPending ? t.management.uploading : t.management.chooseFile}
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={isPending}
          />
        </label>
      </div>
    </div>
  )
}
