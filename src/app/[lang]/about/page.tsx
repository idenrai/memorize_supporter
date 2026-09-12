import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getT } from "@/i18n"
import { locales, type Locale } from "@/i18n/settings"
import type { Lang } from "@/i18n/types"
import AboutClient from "@/components/about/AboutClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!locales.includes(lang as Locale)) {
    return {}
  }
  const validLang = lang as Lang
  const t = getT(validLang)

  const title = `${t.common.about} - ${t.home.title}`
  const description = t.about.intro

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!locales.includes(lang as Locale)) {
    notFound()
  }

  const validLang = lang as Lang

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      <AboutClient lang={validLang} />
    </main>
  )
}
