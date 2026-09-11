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
          background: '#0f172a',
          borderRadius: '7px',
          border: '1px solid rgba(165, 180, 252, 0.3)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
        >
          {/* Back card — high visibility for small size */}
          <g transform="rotate(-8, 16, 19)">
            <rect
              x="7" y="7" width="16" height="22" rx="2.5"
              stroke="#a5b4fc"
              strokeWidth="2.8"
              opacity="0.6"
            />
          </g>

          {/* Front card */}
          <rect
            x="17" y="11" width="16" height="22" rx="2.5"
            stroke="#a5b4fc"
            strokeWidth="2.8"
          />
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
