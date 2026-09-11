import DataPreparationClient from './DataPreparationClient'
import templateFlashcards from '../../../../input/templates/_template_flashcards.json'
import templatePracticeQuiz from '../../../../input/templates/_template_practice_quiz.json'
import templateVocabulary from '../../../../input/templates/_template_vocabulary.json'
import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"

export type TemplateData = {
  id: string
  name: string
  description: string
  content: string
}

export default async function DataPreparationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Lang);
  
  const templates: TemplateData[] = [
    {
      id: 'flashcards',
      name: t.quiz.flashcard,
      description: t.prep.templateFlashcardDesc,
      content: JSON.stringify(templateFlashcards, null, 2)
    },
    {
      id: 'practice_quiz',
      name: t.quiz.practiceQuiz,
      description: t.prep.templateQuizDesc,
      content: JSON.stringify(templatePracticeQuiz, null, 2)
    },
    {
      id: 'vocabulary',
      name: t.quiz.vocabulary,
      description: t.prep.templateVocabDesc,
      content: JSON.stringify(templateVocabulary, null, 2)
    }
  ]

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 tracking-tight break-keep">
          {t.prep.title}
        </h1>
        <p className="text-zinc-400 max-w-3xl font-medium leading-relaxed break-keep text-base">
          {t.prep.desc}
        </p>
      </div>

      <DataPreparationClient templates={templates} />
    </main>
  )
}
