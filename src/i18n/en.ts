import type { Translations } from "./types";

export const en: Translations = {
  common: {
    backToHome: "Back to Home",
    changeLanguage: "Change Language",
    dashboard: "Dashboard",
    dataManagement: "Data Management",
    dataPrep: "Data Prep",
    error: "Error",
    examRecords: "Exam Records",
    exit: "Exit",
    loading: "Loading...",
    settings: "Settings",
    study: "Study",
  },
  home: {
    allCards: "All Cards",
    allSeries: "All Series",
    cards: "Cards",
    defaultDesc: (count) => `A collection of ${count} study cards.`,
    description: "Study with flashcards, quizzes, and vocabulary decks tailored to your learning goals.",
    howToAdd: "How to Add a New Study Deck",
    howToAddStep1: "Go to [Data Prep] and copy the AI prompt for your desired study format (Flashcards, Quizzes, Vocabulary).",
    howToAddStep2: "Paste the prompt into ChatGPT or Claude along with your study material to generate JSON data.",
    howToAddStep3: "Upload the generated JSON file in the [Data Management] page.",
    howToAddStep4: "Return to the Dashboard and start your personalized study session!",
    noSearchResults: "No decks found matching your search.",
    searchDecks: "Search decks...",
    subtitle: "Master your knowledge through active recall and spaced repetition",
    studyLimit: "Cards to Study",
    practiceMode: "Practice Mode",
    examMode: "Exam Mode",
    title: "Memorize Supporter",
    uncategorized: "General (Uncategorized)",
    viewModeGrid: "Grid View",
    viewModeList: "List View",
    welcomeDesc: "Create your first study deck easily with the help of AI.",
    welcomeTitle: "No Study Decks Available",
    yourDecks: "Study Decks",
  },
  prep: {
    aiPrompt: "AI Generation Prompt",
    copied: "Copied to Clipboard",
    copyPrompt: "Copy Prompt",
    desc: "Convert your notes, textbooks, or vocabulary lists into study-ready decks with AI. Simply copy the prompt template and paste it into ChatGPT or Claude.",
    promptFormat: (content) => `Convert my content into a valid JSON array format.
Strict rules:
1. Output ONLY valid JSON.
2. NO markdown formatting, NO \`\`\`json blocks, NO explanations before or after.
3. Every item must strictly follow the schema structure below.
4. If a field is not provided in my content, use a logical default or empty string.

Required Schema:
${content}

My content to convert:`,
    selectTemplate: "Select Study Type",
    templateFlashcardDesc: "Standard front/back cards for quick active recall",
    templateQuizDesc: "Multiple-choice questions with options and explanations",
    templateVocabDesc: "Comprehensive vocabulary cards with meanings and examples",
    title: "AI Study Data Preparation",
  },
  management: {
    cancel: "Cancel",
    chooseFile: "Browse File",
    confirmDelete: "Are you sure you want to permanently delete this deck?",
    delete: "Delete",
    deleteFailed: "Failed to delete deck.",
    deleteSuccess: "Deck deleted successfully.",
    desc: "Upload your JSON study decks, edit titles and series, or manage visibility settings.",
    edit: "Edit",
    editFailed: "Failed to update deck.",
    editSuccess: "Deck updated successfully.",
    hidden: "Hidden",
    hideFailed: "Failed to change visibility.",
    hideSuccess: "Visibility changed.",
    noDecks: "No decks found. Upload your first JSON deck to get started!",
    optional: "None (Optional)",
    save: "Save",
    selectJsonFile: "Drag & drop a JSON file here, or click to browse",
    sourceSystem: "Built-in",
    sourceUser: "Custom",
    thActions: "Actions",
    thCards: "Cards",
    thName: "Deck Name",
    thSeries: "Series / Category",
    thSource: "Source",
    thType: "Type",
    title: "Data Management",
    uploadData: "Upload New Study Deck",
    uploadFailed: "Upload failed.",
    uploadSizeLimitError: "File size cannot exceed 5MB.",
    uploadSuccess: "Deck uploaded successfully!",
    uploading: "Uploading...",
    visible: "Visible",
  },
  quiz: {
    askAi: "Ask AI for In-Depth Explanation",
    aiDeepPrompt: (question, options, explanation) => `Please provide an in-depth explanation and analysis for the following multiple-choice question.
Beyond simply giving the correct answer, explain why the correct option is right, why the incorrect options are wrong, and detail the core concepts (architecture, services, etc.) related to this question.

[Question]
${question}

[Options]
${options}

[Existing Explanation Summary]
${explanation || 'None'}

Based on the above information, please explain clearly so that I can thoroughly understand this concept.`,
    promptCopied: "Prompt copied to clipboard! Paste it into Gemini or ChatGPT.",
    promptCopyFailed: "Failed to copy to clipboard.",
    selectOne: "Select 1",
    selectMultiple: (count) => `Select ${count}`,
    maxSelectionReached: (count) => `You can select up to ${count} answers.`,
    selectionProgress: (current, max) => `(${current}/${max} selected)`,
    correctBadge: "Correct Answer",
    yourChoiceBadge: "Your Choice",
    yourChoiceIncorrectBadge: "Your Choice (Incorrect)",
    retrySessionBadge: "Retry Session",
    reviewingQuestion: (current, total) => `Reviewing Question (${current}/${total})`,
    none: "None",
    unknownCard: "Unknown Card",
    backToDashboard: "Back to Dashboard",
    clickToReveal: "Click to reveal answer",
    correct: "Correct",
    correctAnswers: "Correct Answers",
    easy: "Easy",
    explanation: "Explanation",
    flashcard: "Flashcard",
    hard: "Hard",
    incorrect: "Incorrect",
    next: "Next",
    noCards: "No cards available in this deck.",
    practiceQuiz: "Practice Quiz",
    question: "Question",
    quizCompleted: "Quiz Completed!",
    retryIncorrect: (count) => `Retry Incorrect (${count})`,
    studyNewSession: "Start New Session",
    submit: "Submit",
    vocabulary: "Vocabulary",
    youScored: (correct, total) => `You scored ${correct} out of ${total}!`,
    closeReview: "Back to List",
  },
  error: {
    defaultMessage: "An unexpected error occurred.",
    goHome: "Go back home",
    somethingWentWrong: "Something went wrong!",
    tryAgain: "Try again",
  },
  records: {
    empty: "No exam records yet. Take a practice quiz in Exam Mode to see your results here!",
    viewAll: "View All Decks",
    thCorrect: "Correct / Total",
    thDate: "Date & Time",
    thDeck: "Deck Name",
    thScore: "Score",
    title: "Exam History & Results",
    backToRecords: "Back to Records",
    details: "View Details",
    detailsNotAvailable: "Details not available",
    legacyRecordDesc: "This exam record was created before the detailed recording feature was added, so its question history cannot be displayed.",
    confirmDeleteRecord: "Are you sure you want to permanently delete this exam record?",
    deleteSuccess: "Exam record deleted successfully.",
    deleteFailed: "Failed to delete exam record.",
  },
};
