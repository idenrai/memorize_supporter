import { getExamResultDetails } from "@/actions/records"
import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import { Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ExamResultView from "@/components/cards/ExamResultView"

export default async function ExamResultDetailsPage({
  params
}: {
  params: Promise<{ lang: string, examId: string }>
}) {
  const { lang, examId } = await params
  const validLang = ["en", "ko", "ja"].includes(lang) ? (lang as Lang) : "en"
  const t = getT(validLang)

  const { success, record, playingCards = [], sessionResults = [] } = await getExamResultDetails(examId)

  if (!success || !record) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <Trophy size={48} className="text-zinc-700 mb-6" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-zinc-400 mb-2">{t.records.empty}</h3>
        <Link href={`/${validLang}/records`} className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors">
          {t.records.backToRecords || "Back to Records"}
        </Link>
      </main>
    )
  }

  if (playingCards.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-125 w-full p-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft size={24} className="text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">{t.records.detailsNotAvailable || "Details not available"}</h3>
        <p className="text-zinc-500 mb-8 max-w-md text-center">
          {t.records.legacyRecordDesc || "This exam record was created before the detailed recording feature was added, so its question history cannot be displayed."}
        </p>
        <Link href={`/${validLang}/records`} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors">
          {t.records.backToRecords || "Back to Records"}
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
      <ExamResultView
        playingCards={playingCards}
        sessionResults={sessionResults}
        lang={validLang}
        backLink={`/${validLang}/records`}
        backLinkText={t.records.backToRecords || "Back to Records"}
        originalStats={{
          score: record.score,
          total: record.total,
          correct: record.correct
        }}
      />
    </main>
  )
}
