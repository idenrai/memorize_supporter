'use client'

import type { Deck } from '@/types/deck'
import UploadZone from '@/components/management/UploadZone'
import DeckTable from '@/components/management/DeckTable'

export default function DataManagementClient({ initialDecks }: { initialDecks: Deck[] }) {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      
      {/* Upload Section */}
      <UploadZone />

      {/* Table Section */}
      <DeckTable initialDecks={initialDecks} />
    </div>
  )
}
