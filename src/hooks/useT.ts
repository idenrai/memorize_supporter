import { TRANSLATIONS } from "@/i18n";
import { useParams } from "next/navigation";
import type { Lang } from "@/i18n/types";

export function useT() {
  const params = useParams();
  const lang = (params?.lang as Lang) || "en";
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
