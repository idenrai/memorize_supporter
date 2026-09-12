import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCardTitle, parseCardData, parseCardDataList } from "../../src/lib/card-parser.ts";
import type { CardData } from "../../src/types/card.ts";

describe("card-parser utility", () => {
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
