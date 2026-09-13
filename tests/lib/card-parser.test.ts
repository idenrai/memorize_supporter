import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCardTitle, parseCardData, parseCardDataList } from "../../src/lib/card-parser.ts";
import { type CardData, isQuizType, isQuizCard } from "../../src/types/card.ts";

describe("card-parser utility", () => {
  describe("isQuizType helper", () => {
    it("returns true for supported quiz types", () => {
      assert.strictEqual(isQuizType("multiple_choice_quiz"), true);
      assert.strictEqual(isQuizType("practice_quiz"), true);
      assert.strictEqual(isQuizType("MULTIPLE_CHOICE_QUIZ"), true);
      assert.strictEqual(isQuizType("PRACTICE_QUIZ"), true);
    });

    it("returns false for non-quiz types or falsy inputs", () => {
      assert.strictEqual(isQuizType("multiple_choice"), false);
      assert.strictEqual(isQuizType("quiz"), false);
      assert.strictEqual(isQuizType("flashcard"), false);
      assert.strictEqual(isQuizType("vocabulary"), false);
      assert.strictEqual(isQuizType(null), false);
      assert.strictEqual(isQuizType(undefined), false);
      assert.strictEqual(isQuizType(""), false);
    });
  });

  describe("isQuizCard type guard", () => {
    it("returns true for multiple_choice_quiz and practice_quiz cards", () => {
      const practiceCard: CardData = {
        id: "1",
        type: "practice_quiz",
        content: { question: "Q1", options: ["A", "B"], answers: [0] },
      };
      const mcCard: CardData = {
        id: "2",
        type: "multiple_choice_quiz",
        content: { question: "Q2", options: ["A", "B"], answers: [1] },
      };
      assert.strictEqual(isQuizCard(practiceCard), true);
      assert.strictEqual(isQuizCard(mcCard), true);
    });

    it("returns false for non-quiz cards or falsy inputs", () => {
      const flashcard: CardData = {
        id: "3",
        type: "flashcard",
        content: { front: "F", back: "B" },
      };
      const vocabCard: CardData = {
        id: "4",
        type: "vocabulary",
        content: { word: "W", meaning: "M" },
      };
      assert.strictEqual(isQuizCard(flashcard), false);
      assert.strictEqual(isQuizCard(vocabCard), false);
      assert.strictEqual(isQuizCard(null), false);
      assert.strictEqual(isQuizCard(undefined), false);
    });
  });

  describe("getCardTitle", () => {
    it("extracts question for practice_quiz card", () => {
      const card: CardData = {
        id: "1",
        type: "practice_quiz",
        content: {
          question: "What is TypeScript?",
          options: ["A language", "A fruit"],
          answers: [0],
        },
      };
      assert.strictEqual(getCardTitle(card), "What is TypeScript?");
    });

    it("extracts question for multiple_choice_quiz card", () => {
      const card: CardData = {
        id: "1-mc",
        type: "multiple_choice_quiz",
        content: {
          question: "What is React?",
          options: ["A UI library", "A database"],
          answers: [0],
        },
      };
      assert.strictEqual(getCardTitle(card), "What is React?");
    });

    it("extracts word for vocabulary card", () => {
      const card: CardData = {
        id: "2",
        type: "vocabulary",
        content: {
          word: "Serendipity",
          meaning: "Fortunate accident",
        },
      };
      assert.strictEqual(getCardTitle(card), "Serendipity");
    });

    it("extracts front for flashcard", () => {
      const card: CardData = {
        id: "3",
        type: "flashcard",
        content: {
          front: "Front content",
          back: "Back content",
        },
      };
      assert.strictEqual(getCardTitle(card), "Front content");
    });

    it("returns fallback for unknown card type", () => {
      const card = {
        id: "4",
        type: "unknown_custom",
        content: {},
      } as unknown as CardData;
      assert.strictEqual(getCardTitle(card, "Custom Fallback"), "Custom Fallback");
    });
  });

  describe("parseCardData & parseCardDataList", () => {
    it("parses valid JSON flashcard from DB", () => {
      const raw = {
        id: "c1",
        type: "flashcard",
        content: JSON.stringify({ front: "Q", back: "A" }),
      };
      const result = parseCardData(raw);
      assert.notStrictEqual(result, null);
      assert.strictEqual(result?.type, "flashcard");
      if (result && result.type === "flashcard") {
        assert.strictEqual(result.content.front, "Q");
      }
    });

    it("parses valid JSON practice_quiz and multiple_choice_quiz from DB", () => {
      const rawPractice = {
        id: "q1",
        type: "practice_quiz",
        content: JSON.stringify({ question: "PQ?", options: ["A", "B"], answers: [0] }),
      };
      const resultPractice = parseCardData(rawPractice);
      assert.notStrictEqual(resultPractice, null);
      assert.strictEqual(resultPractice?.type, "practice_quiz");

      const rawMultipleChoice = {
        id: "q2",
        type: "multiple_choice_quiz",
        content: JSON.stringify({ question: "MCQ?", options: ["A", "B"], answers: [1] }),
      };
      const resultMC = parseCardData(rawMultipleChoice);
      assert.notStrictEqual(resultMC, null);
      assert.strictEqual(resultMC?.type, "multiple_choice_quiz");
    });

    it("skips invalid card in parseCardDataList", () => {
      const rawList = [
        {
          id: "c1",
          type: "flashcard",
          content: JSON.stringify({ front: "Q", back: "A" }),
        },
        {
          id: "c2",
          type: "flashcard",
          content: "invalid json",
        },
      ];
      const parsed = parseCardDataList(rawList);
      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].id, "c1");
    });
  });
});
