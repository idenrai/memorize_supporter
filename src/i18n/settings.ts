export const locales = ["en", "ko", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
