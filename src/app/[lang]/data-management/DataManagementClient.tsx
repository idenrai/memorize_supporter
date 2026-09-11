'use client'

import UploadZone from '@/components/management/UploadZone'
import DeckTable from '@/components/management/DeckTable'
import BackupRestoreCard from '@/components/management/BackupRestoreCard'

export default function DataManagementClient() {
  return (
    <div className="flex flex-col gap-8">
      {/* Upload Zone */}
      <UploadZone />

      {/* Deck Management Table Container */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <DeckTable />
      </div>

      {/* Full Device Data Backup & Restore */}
      <BackupRestoreCard />
    </div>
  )
}
