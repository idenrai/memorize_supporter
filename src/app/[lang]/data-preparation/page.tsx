import DataPreparationClient from './DataPreparationClient'
import templateFlashcards from '../../../../input/templates/_template_flashcards.json'
import templatePracticeQuiz from '../../../../input/templates/_template_practice_quiz.json'
import templateVocabulary from '../../../../input/templates/_template_vocabulary.json'
import { getT } from "@/i18n"
import type { Lang } from "@/i18n/types"

import { FileJson } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

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
      <PageHeader
        badge={{
          icon: FileJson,
          label: t.common.dataPrep,
          colorClass: "text-indigo-400",
          bgClass: "bg-indigo-500/10",
          borderClass: "border-indigo-500/30",
        }}
        title={t.prep.title}
        description={t.prep.desc}
      />

      <DataPreparationClient templates={templates} />
    </main>
  )
}
