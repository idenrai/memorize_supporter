"use server"

import { cookies } from "next/headers"
import type { Lang } from "@/i18n"

export async function setLanguageCookie(lang: Lang) {
  const cookieStore = await cookies()
  // Store language cookie for 1 year
  cookieStore.set("lang", lang, { 
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  })
}
