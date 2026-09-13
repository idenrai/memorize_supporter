export type { Translations, Lang } from "./types.ts";
export { LANG_NAMES } from "./types.ts";
export { ko } from "./ko.ts";
export { en } from "./en.ts";
export { ja } from "./ja.ts";

import { ko } from "./ko.ts";
import { en } from "./en.ts";
import { ja } from "./ja.ts";
import type { Lang, Translations } from "./types.ts";

export const TRANSLATIONS: Record<Lang, Translations> = { ko, en, ja };

// Server/Client helper to get translations by lang key
export function getT(lang?: Lang) {
  return TRANSLATIONS[lang as Lang] || TRANSLATIONS.en;
}
