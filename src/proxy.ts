import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { locales, defaultLocale } from "./i18n/settings";

function getLocale(request: NextRequest): string {
  // First, check if there's a cookie
  const cookieLocale = request.cookies.get("lang")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  // Then, check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  const negotiatorHeaders: Record<string, string> = acceptLanguage ? { "accept-language": acceptLanguage } : {};

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Skip root-level PWA files
  if (pathname === "/sw.js" || pathname === "/manifest.webmanifest") {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, public files, service worker)
    '/((?!api|_next/static|_next/image|icon|apple-icon|favicon.ico|manifest\\.webmanifest|sw\\.js|.*\\.(?:xml|json|png|jpg|jpeg|gif|webp|ico|svg|txt)$).*)',
  ],
};
