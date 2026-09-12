import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import { Target } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/common/PageHeader"
import LocalRecordsView from "@/components/records/LocalRecordsView"

export default async function RecordsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ deckId?: string }>
}) {
  const { lang } = await params
  const { deckId } = await searchParams
  const validLang = ["en", "ko", "ja"].includes(lang) ? (lang as Lang) : "en"
  const t = getT(validLang)

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <PageHeader
        badge={{
          icon: Target,
          label: t.common.examRecords,
          colorClass: "text-amber-400",
          bgClass: "bg-amber-500/10",
          borderClass: "border-amber-500/30",
        }}
        title={t.records.title}
        description={t.records.desc}
        action={
          deckId ? (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <div className="px-3.5 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full flex items-center gap-2 text-zinc-300 text-xs font-semibold shadow-inner">
                <Target size={14} className="text-blue-400" aria-hidden="true" />
                <span className="font-mono">{deckId}</span>
              </div>
              <Link
                href={`/${validLang}/records`}
                className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 ml-1 transition-colors font-medium"
              >
                {t.records.viewAll}
              </Link>
            </div>
          ) : undefined
        }
      />

      <LocalRecordsView deckId={deckId} lang={validLang} />
    </main>
  )
}
