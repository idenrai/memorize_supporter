export type Lang = "en" | "ko" | "ja";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
};

export interface Translations {
  common: {
    backToHome: string;
    dataManagement: string;
    dataPrep: string;
    error: string;
    examRecords: string;
    exit: string;
    loading: string;
    settings: string;
    study: string;
  };
  home: {
    allCards: string;
    allSeries: string;
    cards: string;
    defaultDesc: (count: number) => string;
    description: string;
    howToAdd: string;
    noSearchResults: string;
    searchDecks: string;
    subtitle: string;
    studyLimit: string;
    title: string;
    uncategorized: string;
    viewModeGrid: string;
    viewModeList: string;
    welcomeDesc: string;
    welcomeTitle: string;
    yourDecks: string;
  };
  prep: {
    aiPrompt: string;
    copied: string;
    copyPrompt: string;
    desc: string;
    promptFormat: (content: string) => string;
    selectTemplate: string;
    title: string;
  };
  management: {
    cancel: string;
    chooseFile: string;
    confirmDelete: string;
    delete: string;
    deleteFailed: string;
    deleteSuccess: string;
    desc: string;
    edit: string;
    editFailed: string;
    editSuccess: string;
    hidden: string;
    hideFailed: string;
    hideSuccess: string;
    save: string;
    selectJsonFile: string;
    thActions: string;
    thCards: string;
    thName: string;
    thSeries: string;
    thType: string;
    title: string;
    uploadData: string;
    uploadFailed: string;
    uploadSizeLimitError: string;
    uploadSuccess: string;
    uploading: string;
    visible: string;
  };
  quiz: {
    backToDashboard: string;
    clickToReveal: string;
    correct: string;
    correctAnswers: string;
    easy: string;
    explanation: string;
    flashcard: string;
    hard: string;
    incorrect: string;
    next: string;
    noCards: string;
    practiceQuiz: string;
    question: string;
    quizCompleted: string;
    retryIncorrect: (count: number) => string;
    studyNewSession: string;
    submit: string;
    vocabulary: string;
    youScored: (correct: number, total: number) => string;
    closeReview: string;
  };
  error: {
    defaultMessage: string;
    goHome: string;
    somethingWentWrong: string;
    tryAgain: string;
  };
  records: {
    title: string;
    viewAll: string;
    empty: string;
    thDate: string;
    thDeck: string;
    thScore: string;
    thCorrect: string;
    backToRecords: string;
    details: string;
    detailsNotAvailable: string;
    legacyRecordDesc: string;
  };
}
