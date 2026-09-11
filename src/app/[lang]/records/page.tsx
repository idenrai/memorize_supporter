import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import { Target } from "lucide-react"
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
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 tracking-tight break-keep">
          {t.records?.title || "Exam Records"}
        </h1>
        <p className="text-zinc-400 max-w-3xl font-medium leading-relaxed break-keep text-base">
          {t.records?.desc || "Review your past exam scores and analyze your performance on each question."}
        </p>

        {deckId && (
          <div className="flex items-center gap-2 mt-4">
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
