import type { Lang } from "@/i18n/types"
import LocalExamResultDetail from "@/components/records/LocalExamResultDetail"

export default async function ExamResultDetailsPage({
  params
}: {
  params: Promise<{ lang: string; examId: string }>
}) {
  const { lang, examId } = await params
  const validLang = ["en", "ko", "ja"].includes(lang) ? (lang as Lang) : "en"

  return <LocalExamResultDetail examId={examId} lang={validLang} />
}
