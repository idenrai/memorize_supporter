'use client'

import UploadZone from '@/components/management/UploadZone'
import DeckTable from '@/components/management/DeckTable'

interface DataManagementClientProps {
  staticDecks: {
    id: string
    title: string
    type: string
    series: string | null
    _count: { cards: number }
  }[]
}

export default function DataManagementClient({ staticDecks }: DataManagementClientProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      
      {/* Upload Section */}
      <UploadZone />

      {/* Table Section */}
      <DeckTable staticDecks={staticDecks} />
    </div>
  )
}
