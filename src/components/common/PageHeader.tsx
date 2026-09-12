import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  badge?: {
    icon: LucideIcon
    label: string
    colorClass?: string
    bgClass?: string
    borderClass?: string
  }
  title: string
  description: string
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export default function PageHeader({
  badge,
  title,
  description,
  action,
  align = 'left',
  className = '',
}: PageHeaderProps) {
  const isCenter = align === 'center'

  return (
    <div
      className={`mb-8 sm:mb-10 w-full flex flex-col ${
        isCenter ? 'text-center items-center' : 'text-left items-start'
      } ${className}`}
    >
      {badge && (
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-2xs font-bold uppercase tracking-widest shadow-inner w-fit ${
            badge.bgClass || 'bg-indigo-500/10'
          } ${badge.borderClass || 'border border-indigo-500/30'} ${
            badge.colorClass || 'text-indigo-400'
          }`}
        >
          <badge.icon size={14} aria-hidden="true" />
          <span>{badge.label}</span>
        </div>
      )}

      <div
        className={`w-full flex flex-col ${
          !isCenter && action ? 'sm:flex-row sm:items-end sm:justify-between gap-4' : ''
        }`}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 mb-3 break-keep text-balance">
            {title}
          </h1>
          <p
            className={`text-sm sm:text-base text-zinc-400 leading-relaxed break-keep font-medium ${
              isCenter ? 'max-w-2xl mx-auto' : 'max-w-3xl'
            }`}
          >
            {description}
          </p>
        </div>

        {!isCenter && action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
