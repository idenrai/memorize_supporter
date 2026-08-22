import type { Translations } from "./types";

export const ja: Translations = {
  common: {
    backToHome: "ホームに戻る",
    changeLanguage: "言語の変更",
    dashboard: "ダッシュボード",
    dataManagement: "データ管理",
    dataPrep: "データ準備",
    error: "エラー",
    examRecords: "試験記録",
    exit: "終了",
    loading: "読み込み中...",
    settings: "設定",
    study: "学習する",
  },
  home: {
    allCards: "すべてのカード",
    allSeries: "すべてのシリーズ",
    cards: "枚",
    defaultDesc: (count) => `合計 ${count} 枚のカードが含まれる学習デッキです。`,
    description: "フラッシュカード、四択クイズ、単語帳など多彩な形式で学習し、実力をチェックしましょう。",
    howToAdd: "新しい学習デッキを追加する方法",
    howToAddStep1: "上部の [データ準備] メニューで、希望する学習形式（フラッシュカード、クイズ、単語帳）のAIプロンプトをコピーします。",
    howToAddStep2: "ChatGPTやClaudeなどの生成AIにプロンプトと学習素材を渡し、JSONデータを生成します。",
    howToAddStep3: "[データ管理] メニューのアップロードエリアに、生成されたJSONファイルを登録します。",
    howToAddStep4: "ダッシュボードに戻り、あなた専用の学習をすぐに開始しましょう！",
    noSearchResults: "検索結果がありません。",
    searchDecks: "デッキを検索...",
    subtitle: "効率的な反復学習とテストで、確実に記憶を定着させましょう",
    studyLimit: "学習するカード数",
    practiceMode: "練習モード",
    examMode: "試験モード",
    title: "Memorize Supporter",
    uncategorized: "その他 (未分類)",
    viewModeGrid: "グリッド表示",
    viewModeList: "リスト表示",
    welcomeDesc: "AIを活用して、最初の学習デッキを作成してみましょう。",
    welcomeTitle: "登録された学習デッキがありません",
    yourDecks: "学習デッキ一覧",
  },
  prep: {
    aiPrompt: "AI生成プロンプト",
    copied: "クリップボードにコピーしました",
    copyPrompt: "プロンプトをコピー",
    desc: "教材やノート、単語リストなど学習したい素材をAIに渡して、すぐに学習できるデッキに変換しましょう。テンプレートをコピーしてChatGPTやClaudeに貼り付けるだけで作成できます。",
    promptFormat: (content) => `私の入力内容を有効なJSON配列形式に変換してください。
厳格なルール:
1. 有効なJSONのみを出力すること。
2. マークダウン(\`\`\`json)や前後の説明文は絶対に含めないこと。
3. すべての項目は提供されたスキーマ構造に厳格に従うこと。
4. 提供されていないフィールドには論理的なデフォルト値か空文字列を使用すること。

必須スキーマ:
${content}

変換する内容:`,
    selectTemplate: "学習形式を選択",
    templateFlashcardDesc: "表と裏をすばやくめくって確認する基本の暗記カード",
    templateQuizDesc: "選択肢から正解を選び、解説を確認できる選択式問題",
    templateVocabDesc: "見出し語、意味、例文をまとめて学習できる単語帳",
    title: "AI学習データ準備",
  },
  management: {
    cancel: "キャンセル",
    chooseFile: "ファイルを選択",
    confirmDelete: "本当にこのデッキを完全に削除しますか？",
    delete: "削除",
    deleteFailed: "削除に失敗しました。",
    deleteSuccess: "正常に削除されました。",
    desc: "準備した学習デッキ（JSON）をアップロードしたり、デッキ名やシリーズの編集、不要なデッキの非表示・削除を管理できます。",
    edit: "編集",
    editFailed: "編集に失敗しました。",
    editSuccess: "正常に編集されました。",
    hidden: "非表示",
    hideFailed: "表示状態の変更に失敗しました。",
    hideSuccess: "表示状態が変更されました。",
    noDecks: "登録された学習デッキがありません。新しいJSONデッキをアップロードしてみましょう！",
    optional: "未設定 (任意)",
    save: "保存",
    selectJsonFile: "JSONファイルをドラッグ＆ドロップするか、下のボタンをクリックしてください",
    sourceSystem: "プリセット",
    sourceUser: "ユーザー作成",
    thActions: "アクション",
    thCards: "カード数",
    thName: "デッキ名",
    thSeries: "シリーズ / カテゴリ",
    thSource: "ソース",
    thType: "タイプ",
    title: "データ管理",
    uploadData: "新規学習デッキのアップロード",
    uploadFailed: "アップロードに失敗しました。",
    uploadSizeLimitError: "ファイルサイズは5MBを超えることはできません。",
    uploadSuccess: "デッキが正常にアップロードされました！",
    uploading: "アップロード中...",
    visible: "表示",
  },
  quiz: {
    askAi: "AIに詳しい解説を尋ねる",
    aiDeepPrompt: (question, options, explanation) => `以下の選択式問題について、詳細な解説と分析をお願いします。
単に正解を教えるだけでなく、なぜそれが正解なのか、不正解の選択肢はなぜ間違っているのか、そしてこの問題に関連する重要な概念（アーキテクチャやサービス等）について分かりやすく詳しく説明してください。

[問題]
${question}

[選択肢]
${options}

[既存の解説要約]
${explanation || 'なし'}

上記の情報をもとに、私がこの概念を完全に理解できるように分かりやすく解説してください。`,
    promptCopied: "AI質問用プロンプトをコピーしました！GeminiやChatGPTに貼り付けてみてください。",
    promptCopyFailed: "クリップボードへのコピーに失敗しました。",
    selectOne: "1つ選択",
    selectMultiple: (count) => `${count}つ選択`,
    none: "なし",
    unknownCard: "不明なカード",
    backToDashboard: "ダッシュボードに戻る",
    clickToReveal: "クリックして答えを表示",
    correct: "正解",
    correctAnswers: "正解の確認",
    easy: "簡単",
    explanation: "解説",
    flashcard: "フラッシュカード",
    hard: "難しい",
    incorrect: "不正解",
    next: "次へ",
    noCards: "このデッキにはカードがありません。",
    practiceQuiz: "練習問題",
    question: "問題",
    quizCompleted: "学習完了！",
    retryIncorrect: (count) => `間違えた ${count} 問をもう一度学習する`,
    studyNewSession: "新しいセッションを学習する",
    submit: "提出",
    vocabulary: "単語帳",
    youScored: (correct, total) => `全 ${total} 問中 ${correct} 問正解しました！`,
    closeReview: "一覧に戻る",
  },
  error: {
    defaultMessage: "予期せぬエラーが発生しました。",
    goHome: "ホームに戻る",
    somethingWentWrong: "エラーが発生しました！",
    tryAgain: "再試行",
  },
  records: {
    empty: "まだ試験の受験記録がありません。練習問題デッキで試験モードに挑戦してみましょう！",
    viewAll: "すべてのデッキの記録を見る",
    thCorrect: "正解数 (正解/全体)",
    thDate: "受験日時",
    thDeck: "デッキ名",
    thScore: "スコア",
    title: "試験の受験記録",
    backToRecords: "記録一覧へ戻る",
    details: "詳細結果を見る",
    detailsNotAvailable: "詳細な記録は利用できません",
    legacyRecordDesc: "この試験記録は詳細記録機能が追加される前に作成されたため、問題ごとの履歴は表示できません。",
    confirmDeleteRecord: "本当にこの試験記録を削除しますか？",
    deleteSuccess: "試験記録が正常に削除されました。",
    deleteFailed: "試験記録の削除に失敗しました。",
  },
};
