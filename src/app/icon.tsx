import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #31104b 0%, #0f172a 50%, #064e3b 100%)',
          borderRadius: '7px',
          border: '1.5px solid rgba(56, 189, 248, 0.7)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
        >
          <defs>
            <linearGradient id="favBack" x1="10" y1="4" x2="30" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
            <linearGradient id="favFront" x1="4" y1="8" x2="26" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="favSpark" x1="15" y1="12" x2="25" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>

          {/* Back Stacked Card - High Contrast Accent */}
          <rect
            x="11"
            y="4"
            width="19"
            height="23"
            rx="3.5"
            transform="rotate(12 20 15)"
            fill="url(#favBack)"
            stroke="#c7d2fe"
            strokeWidth="1.5"
          />

          {/* Front Active Card - Large & Distinct */}
          <rect
            x="4.5"
            y="9"
            width="22"
            height="23"
            rx="3.5"
            fill="url(#favFront)"
            stroke="#2dd4bf"
            strokeWidth="2"
          />

          {/* Front Card Bold Header Bar */}
          <rect x="7.5" y="12" width="9" height="2.5" rx="1.25" fill="#2dd4bf" />

          {/* Large High-Contrast Synaptic Spark Core */}
          <path
            d="M19.5 13L21.5 18L26.5 19.5L21.5 21L19.5 26L17.5 21L12.5 19.5L17.5 18L19.5 13Z"
            fill="url(#favSpark)"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <circle cx="19.5" cy="19.5" r="1.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    { 
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    }
  )
}
