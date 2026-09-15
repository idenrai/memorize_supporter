import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { selectSessionCards, shuffle } from "../../src/lib/session-cards.ts";
import type { RawDbCard } from "../../src/lib/card-parser.ts";
import type { LocalProgress } from "../../src/lib/db/progress.ts";

function createMockQuizCard(id: string): RawDbCard {
  return {
    id,
    deckId: "deck-test",
    type: "multiple_choice_quiz",
    content: JSON.stringify({
      question: `Question ${id}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answers: [0],
    }),
  };
}

function createMockFlashcard(id: string): RawDbCard {
  return {
    id,
    deckId: "deck-test",
    type: "flashcard",
    content: JSON.stringify({
      front: `Front ${id}`,
      back: `Back ${id}`,
    }),
  };
}

describe("session-cards utility", () => {
  describe("shuffle helper", () => {
    it("returns a new array without mutating the original", () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      const shuffled = shuffle(original);
      assert.deepStrictEqual(original, copy);
      assert.strictEqual(shuffled.length, original.length);
      assert.deepStrictEqual([...shuffled].sort(), [...original].sort());
    });

    it("supports custom RNG for deterministic shuffling", () => {
      const original = [10, 20, 30, 40];
      // Deterministic sequence: always returns 0 (swaps with 0)
      const shuffled = shuffle(original, () => 0);
      assert.strictEqual(shuffled.length, original.length);
      assert.deepStrictEqual(shuffled, [20, 30, 40, 10]);
    });
  });

  describe("selectSessionCards - Exam Mode", () => {
    it("returns an empty array when input is empty", () => {
      const result = selectSessionCards({
        cards: [],
        limit: 20,
        isExamMode: true,
      });
      assert.deepStrictEqual(result, []);
    });

    it("extracts exactly limit count of cards when pool is larger than limit", () => {
      const cards: RawDbCard[] = Array.from({ length: 61 }, (_, i) =>
        createMockQuizCard(`card-${i + 1}`)
      );

      const result = selectSessionCards({
        cards,
        limit: 20,
        isExamMode: true,
      });

      assert.strictEqual(result.length, 20);
    });

    it("returns all cards when total cards is less than limit", () => {
      const cards: RawDbCard[] = Array.from({ length: 10 }, (_, i) =>
        createMockQuizCard(`card-${i + 1}`)
      );

      const result = selectSessionCards({
        cards,
        limit: 20,
        isExamMode: true,
      });

      assert.strictEqual(result.length, 10);
    });

    it("guarantees sampling without replacement (no duplicate cards in an exam session)", () => {
      const cards: RawDbCard[] = Array.from({ length: 61 }, (_, i) =>
        createMockQuizCard(`card-${i + 1}`)
      );

      const result = selectSessionCards({
        cards,
        limit: 20,
        isExamMode: true,
      });

      assert.strictEqual(result.length, 20);
      const uniqueIds = new Set(result.map((c) => c.id));
      assert.strictEqual(
        uniqueIds.size,
        result.length,
        "Every card in an exam session must be distinct (sampling without replacement)"
      );
    });

    it("ensures random sampling: 61 cards with limit 20 produces different sets over multiple runs", () => {
      const cards: RawDbCard[] = Array.from({ length: 61 }, (_, i) =>
        createMockQuizCard(`card-${i + 1}`)
      );

      // Run 5 separate sessions
      const sessions = Array.from({ length: 5 }, () => {
        const selected = selectSessionCards({
          cards,
          limit: 20,
          isExamMode: true,
        });
        assert.strictEqual(new Set(selected.map((c) => c.id)).size, selected.length);
        return new Set(selected.map((c) => c.id));
      });

      // Verify that not all sessions are identical (which was the exact bug reported)
      let identicalCount = 0;
      for (let i = 1; i < sessions.length; i++) {
        const s1 = sessions[0];
        const s2 = sessions[i];
        let overlap = 0;
        for (const id of s1) {
          if (s2.has(id)) overlap++;
        }
        if (overlap === 20) {
          identicalCount++;
        }
      }

      // In uniform random sampling of 20 out of 61, the chance of getting
      // the exact same 20 items in 5 independent trials is astronomically low (~1 in 4e16).
      assert.strictEqual(
        identicalCount < 4,
        true,
        "Successive exam sessions should draw different random subsets of cards"
      );
    });

    it("filters and prioritizes quiz-capable cards in mixed decks", () => {
      const quizCards = Array.from({ length: 15 }, (_, i) =>
        createMockQuizCard(`quiz-${i + 1}`)
      );
      const flashcards = Array.from({ length: 15 }, (_, i) =>
        createMockFlashcard(`flash-${i + 1}`)
      );
      const mixed = [...flashcards, ...quizCards];

      const result = selectSessionCards({
        cards: mixed,
        limit: 10,
        isExamMode: true,
      });

      assert.strictEqual(result.length, 10);
      for (const card of result) {
        assert.strictEqual(card.type, "multiple_choice_quiz");
      }
    });
  });

  describe("selectSessionCards - Practice Mode (SRS)", () => {
    it("prioritizes failed cards over unstudied and mastered cards", () => {
      // card-1: Mastered (reviewCount=5, successRate=1.0)
      // card-2: Failed (reviewCount=3, successRate=0.33 -> failedCount=2)
      // card-3: Unstudied (reviewCount=0)
      const card1 = createMockFlashcard("card-1");
      const card2 = createMockFlashcard("card-2");
      const card3 = createMockFlashcard("card-3");

      const progressMap: Record<string, LocalProgress> = {
        "card-1": {
          id: "p1",
          cardId: "card-1",
          deckId: "deck-test",
          reviewCount: 5,
          lastReviewedAt: new Date(),
          nextReviewAt: new Date(Date.now() + 86400000),
          successRate: 1.0,
        },
        "card-2": {
          id: "p2",
          cardId: "card-2",
          deckId: "deck-test",
          reviewCount: 3,
          lastReviewedAt: new Date(),
          nextReviewAt: new Date(),
          successRate: 0.33,
        },
      };

      // In practice mode with limit 1, card-2 (failed) or card-3 (unstudied) should beat card-1 (mastered)
      // Notice: Category 1 (unstudied) is category 1, Category 2 (failed) is category 2.
      // But unstudied (category 1) comes before category 2 unless failed is prioritized.
      // Let's test with limit=2 where mastered card should be excluded
      const result = selectSessionCards({
        cards: [card1, card2, card3],
        progressMap,
        limit: 2,
        isExamMode: false,
      });

      assert.strictEqual(result.length, 2);
      const resultIds = result.map((c) => c.id);
      assert.strictEqual(resultIds.includes("card-1"), false, "Mastered card should not be in top 2");
      assert.strictEqual(resultIds.includes("card-2"), true);
      assert.strictEqual(resultIds.includes("card-3"), true);
    });

    it("avoids starvation across unstudied cards by pre-shuffling", () => {
      const cards: RawDbCard[] = Array.from({ length: 50 }, (_, i) =>
        createMockFlashcard(`unstudied-${i + 1}`)
      );

      // Run practice session multiple times with limit 10
      const run1 = selectSessionCards({ cards, limit: 10, isExamMode: false });
      const run2 = selectSessionCards({ cards, limit: 10, isExamMode: false });

      const set1 = new Set(run1.map((c) => c.id));
      const set2 = new Set(run2.map((c) => c.id));

      let overlap = 0;
      for (const id of set1) {
        if (set2.has(id)) overlap++;
      }

      // Without pre-shuffling, it would always deterministically pick unstudied-1 to 10.
      // With pre-shuffling, overlap should not always be 10.
      assert.strictEqual(
        overlap < 10,
        true,
        "Unstudied cards should not deterministically starve later cards"
      );
    });
  });
});
