import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import { Trophy, Target } from "lucide-react"
import Link from "next/link"
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
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-500/20 to-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center ring-1 ring-teal-500/30">
            <Trophy size={24} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.records?.title || "Exam Records"}</h1>
          </div>
        </div>

        {deckId && (
          <div className="flex items-center gap-2 mt-4 ml-1">
            <div className="px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-full flex items-center gap-2 text-zinc-300 text-sm font-medium">
              <Target size={14} className="text-blue-400" />
              <span>{deckId}</span>
            </div>
            <Link
              href={`/${validLang}/records`}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2 ml-2 transition-colors"
            >
              {t.records?.viewAll || "View All"}
            </Link>
          </div>
        )}
      </div>

      <LocalRecordsView deckId={deckId} lang={validLang} />
    </main>
  )
}
