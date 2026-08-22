import React from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  className?: string
  animated?: boolean
}

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
        <defs>
          {/* Background Gradient with Rich Indigo-Teal Undertones */}
          <linearGradient id="bgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="45%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#042f2e" />
          </linearGradient>

          {/* High-Luminescence Rim Light */}
          <linearGradient id="rimGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.95" />
          </linearGradient>

          {/* Back Stacked Card Gradient */}
          <linearGradient id="backCardGrad" x1="12" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>

          {/* Front Active Card Gradient */}
          <linearGradient id="frontCardGrad" x1="6" y1="12" x2="28" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.9" />
          </linearGradient>

          {/* Vibrant Spark Core Gradient */}
          <linearGradient id="sparkGrad" x1="17" y1="13" x2="27" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>

        {/* 1. App Icon Squircle Container with Ambient Glow */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          fill="url(#bgGrad)"
          stroke="url(#rimGrad)"
          strokeWidth="1.4"
        />

        {/* 2. Back Stacked Card (Spaced Repetition Deck Layer) */}
        <rect
          x="13"
          y="6"
          width="20"
          height="24"
          rx="4"
          transform="rotate(10 23 18)"
          fill="url(#backCardGrad)"
          stroke="#a5b4fc"
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />
        {/* Back Card Accent Dots */}
        <circle cx="28" cy="11" r="1.1" fill="#c7d2fe" />
        <circle cx="31" cy="15" r="1.1" fill="#c7d2fe" opacity="0.8" />

        {/* 3. Front Active Recall Flashcard */}
        <rect
          x="6.5"
          y="11.5"
          width="22"
          height="23"
          rx="4"
          fill="url(#frontCardGrad)"
          stroke="#2dd4bf"
          strokeWidth="1.5"
        />

        {/* Front Card Header Bar */}
        <rect x="9.5" y="14.5" width="9" height="2.2" rx="1.1" fill="#2dd4bf" />

        {/* 4. Active Recall / Synaptic Spark (기억의 번뜩임 & 지식 라인) */}
        {/* Card Knowledge Content Lines */}
        <line x1="9.5" y1="19.5" x2="16.5" y2="19.5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        <line x1="9.5" y1="23" x2="14" y2="23" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

        {/* Synaptic Recall Spark Symbol */}
        <path
          d="M21.5 17L23.3 21L27.5 22.5L23.3 24L21.5 28L19.7 24L15.5 22.5L19.7 21L21.5 17Z"
          fill="url(#sparkGrad)"
          stroke="#ffffff"
          strokeWidth="0.6"
        />
        
        {/* Luminous Glow Core on Spark */}
        <circle cx="21.5" cy="22.5" r="1.2" fill="#ffffff" />
      </svg>
    </div>
  )
}
