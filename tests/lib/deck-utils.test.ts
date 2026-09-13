import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getDeckTypeLabel, getDeckTypeBadgeClass } from "../../src/lib/deck-utils.ts";
import { getT } from "../../src/i18n/index.ts";

describe("deck-utils", () => {
  describe("getDeckTypeLabel", () => {
    it("returns correct localized label in Korean (ko)", () => {
      const t = getT("ko");
      assert.strictEqual(getDeckTypeLabel("multiple_choice_quiz", t), "객관식 퀴즈");
      assert.strictEqual(getDeckTypeLabel("practice_quiz", t), "객관식 퀴즈");
      assert.strictEqual(getDeckTypeLabel("flashcard", t), "플래시카드");
      assert.strictEqual(getDeckTypeLabel("vocabulary", t), "단어장");
      assert.strictEqual(getDeckTypeLabel(null, t), "플래시카드");
      assert.strictEqual(getDeckTypeLabel(undefined, t), "플래시카드");
      assert.strictEqual(getDeckTypeLabel("", t), "플래시카드");
    });

    it("returns correct localized label in English (en)", () => {
      const t = getT("en");
      assert.strictEqual(getDeckTypeLabel("multiple_choice_quiz", t), "Multiple-Choice Quiz");
      assert.strictEqual(getDeckTypeLabel("practice_quiz", t), "Multiple-Choice Quiz");
      assert.strictEqual(getDeckTypeLabel("flashcard", t), "Flashcard");
      assert.strictEqual(getDeckTypeLabel("vocabulary", t), "Vocabulary");
    });

    it("returns correct localized label in Japanese (ja)", () => {
      const t = getT("ja");
      assert.strictEqual(getDeckTypeLabel("multiple_choice_quiz", t), "選択式クイズ");
      assert.strictEqual(getDeckTypeLabel("practice_quiz", t), "選択式クイズ");
      assert.strictEqual(getDeckTypeLabel("flashcard", t), "フラッシュカード");
      assert.strictEqual(getDeckTypeLabel("vocabulary", t), "単語帳");
    });
  });

  describe("getDeckTypeBadgeClass", () => {
    it("returns indigo tinted classes for quiz types", () => {
      assert.strictEqual(
        getDeckTypeBadgeClass("multiple_choice_quiz"),
        "bg-indigo-950/50 text-indigo-300 border-indigo-800/60"
      );
      assert.strictEqual(
        getDeckTypeBadgeClass("practice_quiz"),
        "bg-indigo-950/50 text-indigo-300 border-indigo-800/60"
      );
    });

    it("returns emerald tinted classes for vocabulary", () => {
      assert.strictEqual(
        getDeckTypeBadgeClass("vocabulary"),
        "bg-emerald-950/40 text-emerald-300 border-emerald-800/50"
      );
    });

    it("returns zinc neutral classes for flashcard and falsy inputs", () => {
      assert.strictEqual(
        getDeckTypeBadgeClass("flashcard"),
        "bg-zinc-800/80 text-zinc-300 border-zinc-700/60"
      );
      assert.strictEqual(
        getDeckTypeBadgeClass(null),
        "bg-zinc-800/80 text-zinc-300 border-zinc-700/60"
      );
      assert.strictEqual(
        getDeckTypeBadgeClass(undefined),
        "bg-zinc-800/80 text-zinc-300 border-zinc-700/60"
      );
    });
  });
});
