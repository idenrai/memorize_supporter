import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"
import { getExamRecords } from "@/actions/records"
import { Trophy, Calendar, Target } from "lucide-react"
import Link from "next/link"
import DeleteRecordButton from "@/components/records/DeleteRecordButton"

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
  
  const response = await getExamRecords(deckId)
  const success = response.success
  const records = response.records || []
  const deckTitle = response.deckTitle

  const dateFormatter = new Intl.DateTimeFormat(validLang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const formatDate = (date: Date) => dateFormatter.format(new Date(date))

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-500/20 to-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center ring-1 ring-teal-500/30">
            <Trophy size={24} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.records.title}</h1>
          </div>
        </div>
        
        {deckId && deckTitle && (
          <div className="flex items-center gap-2 mt-4 ml-1">
            <div className="px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-full flex items-center gap-2 text-zinc-300 text-sm font-medium">
              <Target size={14} className="text-blue-400" />
              <span>{deckTitle}</span>
            </div>
            <Link href={`/${validLang}/records`} className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2 ml-2 transition-colors">
              {t.records.viewAll || "View All"}
            </Link>
          </div>
        )}
      </div>

      {!success || records.length === 0 ? (
        <div className="text-center p-12 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl mt-2 w-full flex flex-col items-center justify-center min-h-75">
          <Trophy size={48} className="text-zinc-700 mb-6" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-zinc-400 mb-2">{t.records.empty}</h3>
          <Link href={`/${validLang}`} className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors">
            {t.common.backToHome}
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-x-auto shadow-lg">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-150" aria-label={t.records.title}>
            <thead className="bg-zinc-800/50 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500">{t.records.thDate}</th>
                {!deckId && <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500">{t.records.thDeck}</th>}
                <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500">{t.records.thScore}</th>
                <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500">{t.records.thCorrect}</th>
                <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 text-right">
                  <span className="sr-only">{t.records.details || "Details"}</span>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 text-right">
                  <span className="sr-only">{t.management?.delete || "Delete"}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-zinc-800/40 transition-colors group">
                  <td className="px-6 py-4 text-zinc-400 tabular-nums">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-zinc-500" />
                      {formatDate(record.createdAt)}
                    </div>
                  </td>
                  {!deckId && <td className="px-6 py-4 text-zinc-200 font-medium truncate max-w-50">{record.deck.title}</td>}
                  <td className="px-6 py-4">
                    <span className={`font-bold px-2.5 py-1 rounded-md text-xs tracking-wider tabular-nums ${
                      record.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      record.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {record.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-medium tabular-nums">{record.correct} / {record.total}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/${validLang}/records/${record.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-teal-500/20 hover:text-teal-400 transition-colors" aria-label={t.records.details || "View Details"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right pl-0 w-16">
                    <DeleteRecordButton id={record.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
