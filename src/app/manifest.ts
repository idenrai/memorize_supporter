import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Memorize Supporter',
    short_name: 'Memorize',
    description: 'A premium smart flashcard application to support your learning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#18181b', // zinc-900
    theme_color: '#6366f1', // indigo-500 (Main brand color)
    icons: [
      {
        src: '/icon', // Next.js dynamic icon route
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon', // Next.js dynamic apple-icon route
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  }
}
