import DataPreparationClient from './DataPreparationClient'
import templateFlashcards from '../../../../input/templates/_template_flashcards.json'
import templatePracticeQuiz from '../../../../input/templates/_template_practice_quiz.json'
import templateVocabulary from '../../../../input/templates/_template_vocabulary.json'
import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"

export type TemplateData = {
  id: string
  name: string
  content: string
}

export default async function DataPreparationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Lang);
  
  const templates: TemplateData[] = [
    {
      id: '_template_flashcards.json',
      name: t.quiz.flashcard,
      content: JSON.stringify(templateFlashcards, null, 2)
    },
    {
      id: '_template_practice_quiz.json',
      name: t.quiz.practiceQuiz,
      content: JSON.stringify(templatePracticeQuiz, null, 2)
    },
    {
      id: '_template_vocabulary.json',
      name: t.quiz.vocabulary,
      content: JSON.stringify(templateVocabulary, null, 2)
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-8 md:pt-12">
      <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">{t.prep.title}</h1>
      <p className="text-zinc-400 mb-10 max-w-2xl font-medium text-balance">
        {t.prep.desc}
      </p>

      <DataPreparationClient templates={templates} lang={lang as Lang} />
    </div>
  )
}
