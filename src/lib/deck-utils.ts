import { isQuizType } from "../types/card.ts";
import type { Translations } from "../i18n/types.ts";

/**
 * Returns a localized human-readable label for a deck or card type.
 * Supports backward compatibility by treating both 'practice_quiz' and 'multiple_choice_quiz'
 * as the localized quiz label.
 */
export function getDeckTypeLabel(
  type: string | undefined | null,
  t: Translations
): string {
  if (isQuizType(type)) {
    return t.quiz.practiceQuiz;
  }
  if (type === "vocabulary") {
    return t.quiz.vocabulary;
  }
  return t.quiz.flashcard;
}

/**
 * Returns Tailwind CSS classes for styling a deck or card type badge.
 * Provides subtle visual hierarchy: Quiz (subtle indigo tint), Vocabulary (subtle emerald tint), Flashcard (neutral zinc).
 */
export function getDeckTypeBadgeClass(type: string | undefined | null): string {
  if (isQuizType(type)) {
    return "bg-indigo-950/50 text-indigo-300 border-indigo-800/60";
  }
  if (type === "vocabulary") {
    return "bg-emerald-950/40 text-emerald-300 border-emerald-800/50";
  }
  return "bg-zinc-800/80 text-zinc-300 border-zinc-700/60";
}

