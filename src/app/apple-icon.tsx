import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2e1065 0%, #0f172a 45%, #042f2e 100%)',
          borderRadius: '40px',
          border: '3px solid rgba(56, 189, 248, 0.75)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="135"
          height="135"
          viewBox="0 0 40 40"
          fill="none"
        >
          <defs>
            <linearGradient id="appleIconBack" x1="12" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="appleIconFront" x1="6" y1="12" x2="28" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="appleIconSpark" x1="17" y1="13" x2="27" y2="27" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>

          {/* Back Stacked Card */}
          <rect
            x="13"
            y="6"
            width="20"
            height="24"
            rx="4"
            transform="rotate(10 23 18)"
            fill="url(#appleIconBack)"
            stroke="#a5b4fc"
            strokeWidth="1.3"
          />
          {/* Back Card Accent Dots */}
          <circle cx="28" cy="11" r="1.1" fill="#c7d2fe" />
          <circle cx="31" cy="15" r="1.1" fill="#c7d2fe" opacity="0.8" />

          {/* Front Active Recall Card */}
          <rect
            x="6.5"
            y="11.5"
            width="22"
            height="23"
            rx="4"
            fill="url(#appleIconFront)"
            stroke="#2dd4bf"
            strokeWidth="1.6"
          />

          {/* Front Card Header Bar */}
          <rect x="9.5" y="14.5" width="9" height="2.2" rx="1.1" fill="#2dd4bf" />

          {/* Knowledge Lines */}
          <line x1="9.5" y1="19.5" x2="16.5" y2="19.5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <line x1="9.5" y1="23" x2="14" y2="23" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

          {/* Active Recall Spark */}
          <path
            d="M21.5 17L23.3 21L27.5 22.5L23.3 24L21.5 28L19.7 24L15.5 22.5L19.7 21L21.5 17Z"
            fill="url(#appleIconSpark)"
            stroke="#ffffff"
            strokeWidth="0.6"
          />
          <circle cx="21.5" cy="22.5" r="1.3" fill="#ffffff" />
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
