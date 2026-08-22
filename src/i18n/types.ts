export type Lang = "en" | "ko" | "ja";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
};

export interface Translations {
  common: {
    backToHome: string;
    changeLanguage: string;
    dashboard: string;
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
    howToAddStep1: string;
    howToAddStep2: string;
    howToAddStep3: string;
    howToAddStep4: string;
    noSearchResults: string;
    searchDecks: string;
    subtitle: string;
    studyLimit: string;
    practiceMode: string;
    examMode: string;
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
    templateFlashcardDesc: string;
    templateQuizDesc: string;
    templateVocabDesc: string;
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
    noDecks: string;
    optional: string;
    save: string;
    selectJsonFile: string;
    sourceSystem: string;
    sourceUser: string;
    thActions: string;
    thCards: string;
    thName: string;
    thSeries: string;
    thSource: string;
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
    askAi: string;
    aiDeepPrompt: (question: string, options: string, explanation: string) => string;
    promptCopied: string;
    promptCopyFailed: string;
    selectOne: string;
    selectMultiple: (count: number) => string;
    none: string;
    unknownCard: string;
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
    confirmDeleteRecord: string;
    deleteSuccess: string;
    deleteFailed: string;
  };
}
