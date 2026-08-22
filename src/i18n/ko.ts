import type { Translations } from "./types";

export const ko: Translations = {
  common: {
    backToHome: "홈으로 돌아가기",
    changeLanguage: "언어 변경",
    dashboard: "대시보드",
    dataManagement: "데이터 관리",
    dataPrep: "데이터 준비",
    error: "오류",
    examRecords: "시험 기록",
    exit: "종료",
    loading: "로딩 중...",
    settings: "설정",
    study: "학습하기",
  },
  home: {
    allCards: "전체 카드",
    allSeries: "전체 시리즈",
    cards: "장",
    defaultDesc: (count) => `총 ${count}장의 카드가 포함된 학습 덱입니다.`,
    description: "플래시카드, 4지선다 퀴즈, 단어장 등 다양한 형식으로 암기하고 실력을 점검하세요.",
    howToAdd: "새로운 학습 덱을 추가하는 방법",
    howToAddStep1: "상단 [데이터 준비] 메뉴에서 원하는 학습 유형(플래시카드, 퀴즈, 단어장)의 AI 프롬프트를 복사합니다.",
    howToAddStep2: "ChatGPT나 Claude 등 생성형 AI에 프롬프트와 학습할 자료를 전달하여 JSON 데이터를 생성합니다.",
    howToAddStep3: "[데이터 관리] 메뉴의 파일 업로드 영역에 생성된 JSON 파일을 등록합니다.",
    howToAddStep4: "대시보드로 돌아와 나만의 맞춤형 학습을 바로 시작하세요!",
    noSearchResults: "검색 결과가 없습니다.",
    searchDecks: "덱 검색...",
    subtitle: "효율적인 반복 학습과 테스트로 완벽하게 기억하세요",
    studyLimit: "학습할 카드 수",
    practiceMode: "연습 모드",
    examMode: "시험 모드",
    title: "Memorize Supporter",
    uncategorized: "기타 (미분류)",
    viewModeGrid: "그리드 뷰",
    viewModeList: "리스트 뷰",
    welcomeDesc: "AI를 활용해 손쉽게 첫 번째 학습 덱을 만들어 보세요.",
    welcomeTitle: "등록된 학습 덱이 없습니다",
    yourDecks: "학습 덱 목록",
  },
  prep: {
    aiPrompt: "AI 생성 프롬프트",
    copied: "클립보드에 복사됨",
    copyPrompt: "프롬프트 복사하기",
    desc: "교재, 필기노트, 단어 목록 등 학습하고 싶은 자료를 AI에게 전달하여 즉시 학습 가능한 덱으로 변환해 보세요. 아래 템플릿 프롬프트를 복사해 ChatGPT나 Claude에 붙여넣기만 하면 됩니다.",
    promptFormat: (content) => `내용을 유효한 JSON 배열 형식으로 변환해줘.
엄격한 규칙:
1. 오직 유효한 JSON 형식만 출력할 것.
2. 마크다운(\`\`\`json)이나 앞뒤 설명 문구를 절대 포함하지 말 것.
3. 모든 항목은 반드시 아래 제공된 스키마 구조를 따를 것.
4. 내용이 없는 필드는 적절한 기본값이나 빈 문자열을 사용할 것.

필수 스키마 구조:
${content}

변환할 내용:`,
    selectTemplate: "학습 유형 선택",
    templateFlashcardDesc: "질문과 정답을 빠르게 뒤집어 확인하는 기본 암기 카드",
    templateQuizDesc: "보기 중 정답을 고르고 해설을 확인할 수 있는 객관식 문제",
    templateVocabDesc: "표제어, 발음, 의미, 예문을 종합적으로 학습하는 단어장",
    title: "AI 학습 데이터 준비",
  },
  management: {
    cancel: "취소",
    chooseFile: "파일 선택하기",
    confirmDelete: "정말로 이 덱을 영구적으로 삭제하시겠습니까?",
    delete: "삭제",
    deleteFailed: "삭제에 실패했습니다.",
    deleteSuccess: "성공적으로 삭제되었습니다.",
    desc: "준비한 학습 덱(JSON)을 업로드하거나, 덱의 제목 및 시리즈 수정, 불필요한 덱의 숨김/삭제를 관리할 수 있습니다.",
    edit: "수정",
    editFailed: "수정에 실패했습니다.",
    editSuccess: "성공적으로 수정되었습니다.",
    hidden: "숨김",
    hideFailed: "표시 상태 변경에 실패했습니다.",
    hideSuccess: "표시 상태가 변경되었습니다.",
    noDecks: "등록된 학습 덱이 없습니다. 새 JSON 덱을 업로드해 보세요.",
    optional: "미지정 (선택)",
    save: "저장",
    selectJsonFile: "JSON 파일을 드래그하여 놓거나 아래 버튼을 클릭하세요",
    sourceSystem: "기본 제공",
    sourceUser: "사용자 등록",
    thActions: "작업",
    thCards: "카드 수",
    thName: "덱 이름",
    thSeries: "시리즈 / 카테고리",
    thSource: "출처",
    thType: "유형",
    title: "데이터 관리",
    uploadData: "새 학습 덱 업로드",
    uploadFailed: "업로드에 실패했습니다.",
    uploadSizeLimitError: "파일 크기는 5MB를 초과할 수 없습니다.",
    uploadSuccess: "성공적으로 업로드되었습니다!",
    uploading: "업로드 중...",
    visible: "표시",
  },
  quiz: {
    askAi: "AI에게 심층 해설 요청하기",
    aiDeepPrompt: (question, options, explanation) => `아래 객관식 문제에 대해 깊이 있는 해설과 분석을 부탁합니다.
단순히 정답을 알려주는 것을 넘어, 정답인 이유와 오답들이 왜 오답인지, 그리고 이 문제와 관련된 핵심 개념(아키텍처, 서비스 등)은 무엇인지 상세히 설명해 주세요.

[문제]
${question}

[보기]
${options}

[기존 해설 요약]
${explanation || '없음'}

위 정보를 바탕으로, 제가 이 개념을 완벽하게 이해할 수 있도록 알기 쉽게 설명해 주세요.`,
    promptCopied: "AI에게 질문할 프롬프트가 복사되었습니다! Gemini나 ChatGPT에 붙여넣어 보세요.",
    promptCopyFailed: "클립보드 복사에 실패했습니다.",
    selectOne: "1개 선택",
    selectMultiple: (count) => `${count}개 선택`,
    none: "없음",
    unknownCard: "알 수 없는 카드",
    backToDashboard: "대시보드로 돌아가기",
    clickToReveal: "클릭하여 정답 확인",
    correct: "정답",
    correctAnswers: "정답 확인",
    easy: "쉬움",
    explanation: "해설",
    flashcard: "플래시카드",
    hard: "어려움",
    incorrect: "오답",
    next: "다음",
    noCards: "이 덱에는 카드가 없습니다.",
    practiceQuiz: "연습 문제",
    question: "문제",
    quizCompleted: "퀴즈 완료!",
    retryIncorrect: (count) => `틀린 문제만 다시 풀기 (${count}개)`,
    studyNewSession: "새로운 세션 시작",
    submit: "정답 확인",
    vocabulary: "단어장",
    youScored: (correct, total) => `총 ${total}문제 중 ${correct}문제를 맞혔습니다!`,
    closeReview: "목록으로 돌아가기",
  },
  error: {
    defaultMessage: "예상치 못한 오류가 발생했습니다.",
    goHome: "홈으로 돌아가기",
    somethingWentWrong: "오류가 발생했습니다!",
    tryAgain: "다시 시도하기",
  },
  records: {
    empty: "아직 응시한 시험 기록이 없습니다. 연습 문제 덱에서 시험 모드를 시작해 보세요!",
    viewAll: "전체 덱 기록 보기",
    thCorrect: "정답 수 (정답/전체)",
    thDate: "응시 일시",
    thDeck: "덱 이름",
    thScore: "점수",
    title: "시험 응시 기록",
    backToRecords: "기록 목록으로 돌아가기",
    details: "상세 결과 보기",
    detailsNotAvailable: "상세 기록을 제공할 수 없습니다.",
    legacyRecordDesc: "이 시험 기록은 상세 기록 기능이 추가되기 전에 생성되었기 때문에 문항별 내역을 표시할 수 없습니다.",
    confirmDeleteRecord: "정말로 이 시험 기록을 삭제하시겠습니까?",
    deleteSuccess: "기록이 삭제되었습니다.",
    deleteFailed: "기록 삭제에 실패했습니다.",
  },
};
