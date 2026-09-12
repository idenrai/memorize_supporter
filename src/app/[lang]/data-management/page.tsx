import DataManagementClient from '@/components/management/DataManagementClient'
import { getT } from '@/i18n'
import type { Lang } from '@/i18n/types'
import { Database } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

export default async function DataManagementPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getT(lang as Lang)

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <PageHeader
        badge={{
          icon: Database,
          label: t.common.dataManagement,
          colorClass: "text-indigo-400",
          bgClass: "bg-indigo-500/10",
          borderClass: "border-indigo-500/30",
        }}
        title={t.management.title}
        description={t.management.desc}
      />
      
      <DataManagementClient />
    </main>
  )
}
