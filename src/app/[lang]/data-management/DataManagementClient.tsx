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
      <div className="card-precision p-6 md:p-8">
        <DeckTable />
      </div>

      {/* Full Device Data Backup & Restore */}
      <BackupRestoreCard />
    </div>
  )
}
