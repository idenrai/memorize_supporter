export type { Translations, Lang } from "./types";
export { LANG_NAMES } from "./types";
export { ko } from "./ko";
export { en } from "./en";
export { ja } from "./ja";

import { ko } from "./ko";
import { en } from "./en";
import { ja } from "./ja";
import type { Lang, Translations } from "./types";

export const TRANSLATIONS: Record<Lang, Translations> = { ko, en, ja };

// Server/Client helper to get translations by lang key
export function getT(lang?: Lang) {
  return TRANSLATIONS[lang as Lang] || TRANSLATIONS.en;
}
