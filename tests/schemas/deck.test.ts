import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DeckSchema, CardSchema } from "../../src/schemas/deck.ts";

describe("DeckSchema & CardSchema Validation", () => {
  it("successfully parses deck with null description and null series", () => {
    const input = {
      title: "Sample Vocabulary Deck",
      description: null,
      series: null,
      type: "vocabulary",
      cards: [
        {
          id: null,
          word: "apple",
          meaning: "사과",
          example: null
        }
      ]
    };

    const parsed = DeckSchema.parse(input);
    assert.strictEqual(parsed.title, "Sample Vocabulary Deck");
    assert.strictEqual(parsed.description, null);
    assert.strictEqual(parsed.series, null);
    assert.strictEqual(parsed.cards.length, 1);
    assert.strictEqual(parsed.cards[0].word, "apple");
    assert.strictEqual(parsed.cards[0].example, null);
  });

  it("successfully parses deck when optional fields are omitted (undefined)", () => {
    const input = {
      title: "Minimal Deck",
      cards: [
        {
          front: "Front",
          back: "Back"
        }
      ]
    };

    const parsed = DeckSchema.parse(input);
    assert.strictEqual(parsed.title, "Minimal Deck");
    assert.strictEqual(parsed.type, "flashcard"); // default value
    assert.strictEqual(parsed.description, undefined);
    assert.strictEqual(parsed.series, undefined);
    assert.strictEqual(parsed.cards.length, 1);
  });

  it("successfully parses practice quiz cards with nullable fields", () => {
    const cardInput = {
      id: "q1",
      type: "practice_quiz",
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      answers: [1],
      answer: null,
      explanation: null,
      category: null
    };

    const parsed = CardSchema.parse(cardInput);
    assert.strictEqual(parsed.question, "What is 2 + 2?");
    assert.deepStrictEqual(parsed.answers, [1]);
    assert.strictEqual(parsed.answer, null);
    assert.strictEqual(parsed.explanation, null);
  });

  it("rejects deck with empty title", () => {
    const input = {
      title: "",
      cards: [{ front: "Q", back: "A" }]
    };

    assert.throws(
      () => DeckSchema.parse(input),
      (err: Error) => err.message.includes("Title is required")
    );
  });

  it("rejects deck with zero cards", () => {
    const input = {
      title: "Empty Deck",
      cards: []
    };

    assert.throws(
      () => DeckSchema.parse(input),
      (err: Error) => err.message.includes("At least one card is required")
    );
  });
});
