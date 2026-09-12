import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FlashcardContentSchema,
  PracticeQuizContentSchema,
  VocabularyContentSchema,
} from "../../src/schemas/card-content.ts";

describe("Card Content Schemas Validation", () => {
  describe("FlashcardContentSchema", () => {
    it("successfully validates valid flashcard content", () => {
      const valid = {
        front: "Question 1",
        back: "Answer 1",
        category: "General",
      };
      const parsed = FlashcardContentSchema.parse(valid);
      assert.strictEqual(parsed.front, "Question 1");
      assert.strictEqual(parsed.back, "Answer 1");
      assert.strictEqual(parsed.category, "General");
    });

    it("allows optional category to be omitted", () => {
      const valid = {
        front: "Front only",
        back: "Back only",
      };
      const parsed = FlashcardContentSchema.parse(valid);
      assert.strictEqual(parsed.category, undefined);
    });

    it("rejects missing front or back", () => {
      assert.throws(() => FlashcardContentSchema.parse({ front: "No back" }));
      assert.throws(() => FlashcardContentSchema.parse({ back: "No front" }));
    });
  });

  describe("PracticeQuizContentSchema", () => {
    it("successfully validates valid practice quiz content", () => {
      const valid = {
        question: "What is 1 + 1?",
        options: ["1", "2", "3"],
        answers: [1],
        explanation: "Basic arithmetic",
      };
      const parsed = PracticeQuizContentSchema.parse(valid);
      assert.strictEqual(parsed.question, "What is 1 + 1?");
      assert.deepStrictEqual(parsed.answers, [1]);
      assert.strictEqual(parsed.explanation, "Basic arithmetic");
    });

    it("allows optional fields to be omitted", () => {
      const valid = {
        question: "Minimal quiz",
        options: ["A", "B"],
        answers: [0],
      };
      const parsed = PracticeQuizContentSchema.parse(valid);
      assert.strictEqual(parsed.explanation, undefined);
      assert.strictEqual(parsed.category, undefined);
    });

    it("rejects non-array options or answers", () => {
      assert.throws(() =>
        PracticeQuizContentSchema.parse({
          question: "Invalid",
          options: "not-an-array",
          answers: [0],
        })
      );
    });
  });

  describe("VocabularyContentSchema", () => {
    it("successfully validates valid vocabulary content", () => {
      const valid = {
        word: "serendipity",
        meaning: "뜻밖의 행운",
        example: "A fortunate stroke of serendipity.",
      };
      const parsed = VocabularyContentSchema.parse(valid);
      assert.strictEqual(parsed.word, "serendipity");
      assert.strictEqual(parsed.meaning, "뜻밖의 행운");
      assert.strictEqual(parsed.example, "A fortunate stroke of serendipity.");
    });

    it("allows optional example to be omitted", () => {
      const valid = {
        word: "ephemeral",
        meaning: "덧없는",
      };
      const parsed = VocabularyContentSchema.parse(valid);
      assert.strictEqual(parsed.example, undefined);
    });

    it("rejects missing word or meaning", () => {
      assert.throws(() => VocabularyContentSchema.parse({ word: "solo" }));
      assert.throws(() => VocabularyContentSchema.parse({ meaning: "solo" }));
    });
  });
});
