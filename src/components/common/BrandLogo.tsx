import React from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  className?: string
  animated?: boolean
}

/**
 * Memorize Supporter — "The Deck" Pictorial Mark
 *
 * Two flashcards fanned at a slight angle, representing a study deck.
 * Back card rotated -8° with strong visibility (opacity 0.55).
 * Both cards clearly distinguishable at favicon size (32px).
 *
 * Palette: 2 colors only
 *   - Background: #0f172a (slate-900)
 *   - Mark: #a5b4fc (indigo-300)
 */
export default function BrandLogo({ size = 'md', className = '', animated = true }: BrandLogoProps) {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'sm' ? 24 
    : size === 'md' ? 32 
    : size === 'lg' ? 44 
    : 64

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 select-none ${animated ? 'transition-transform duration-300 group-hover:scale-105' : ''} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Container */}
        <rect
          x="1" y="1" width="38" height="38" rx="10"
          fill="#0f172a"
          stroke="#a5b4fc"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Back card — rotated -8°, high visibility */}
        <g transform="rotate(-8, 16, 19)">
          <rect
            x="7" y="7" width="16" height="22" rx="2.5"
            stroke="#a5b4fc"
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* Front card — offset right+down, full opacity */}
        <rect
          x="17" y="11" width="16" height="22" rx="2.5"
          stroke="#a5b4fc"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
