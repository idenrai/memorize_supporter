export type Lang = "en" | "ko" | "ja";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
};

export interface Translations {
  common: {
    backToHome: string;
    exit: string;
    settings: string;
    loading: string;
    study: string;
    error: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    yourDecks: string;
    uncategorized: string;
    welcomeTitle: string;
    welcomeDesc: string;
    howToAdd: string;
    cards: string;
    allCards: string;
    searchDecks: string;
    allSeries: string;
    noSearchResults: string;
    defaultDesc: (count: number) => string;
  };
  quiz: {
    noCards: string;
    quizCompleted: string;
    youScored: (correct: number, total: number) => string;
    retryIncorrect: (count: number) => string;
    studyNewSession: string;
    backToDashboard: string;
    submit: string;
    next: string;
    correctAnswers: string;
    explanation: string;
    hard: string;
    easy: string;
    clickToReveal: string;
    vocabulary: string;
    flashcard: string;
    practiceQuiz: string;
    correct: string;
    incorrect: string;
  };
  error: {
    somethingWentWrong: string;
    defaultMessage: string;
    goHome: string;
    tryAgain: string;
  };
}
