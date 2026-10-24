// Resolve the locale per request so the first render matches the visitor.
import { headers, cookies } from 'next/headers'
import { countryFromHeaders, resolveVisitorLocale, LANGUAGE_COOKIE, CURRENCY_COOKIE } from './visitor-locale'
import type { Lang } from './currencies'

export interface ServerLocale {
  lang: Lang
  currency: string
  countryCode?: string
}

export async function resolveServerLocale(): Promise<ServerLocale> {
  const [h, c] = await Promise.all([headers(), cookies()])
  return resolveVisitorLocale(
    countryFromHeaders(h),
    c.get(LANGUAGE_COOKIE)?.value,
    c.get(CURRENCY_COOKIE)?.value,
  )
}
