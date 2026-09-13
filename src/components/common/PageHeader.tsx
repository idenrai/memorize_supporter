import React from 'react'

interface PageHeaderProps {
  title: string
  description: string
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export default function PageHeader({
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

      <div
        className={`w-full flex flex-col ${
          !isCenter && action ? 'sm:flex-row sm:items-end sm:justify-between gap-4' : ''
        }`}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 mb-2 break-keep text-balance">
            {title}
          </h1>
          <p
            className={`text-sm sm:text-base text-zinc-400 leading-relaxed break-keep font-normal ${
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
