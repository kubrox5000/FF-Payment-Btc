// Server-side locale resolution so the first render already matches the visitor.
// Imported only from server components (App Router) — never from client code.
import { headers, cookies } from 'next/headers'
import { type Lang } from './currencies'
import { detectLocale } from './locale-detection'

export const OVERRIDE_COOKIE = 'ff_locale_lang'
export const COUNTRY_COOKIE = 'ff_country'

export interface ServerLocale {
  lang: Lang
  currency: string
  countryCode?: string
  countryDetected?: boolean
}

/** Resolve the visitor's locale on the server, without any network call. */
export async function resolveServerLocale(): Promise<ServerLocale> {
  const [h, c] = await Promise.all([headers(), cookies()])

  return detectLocale(h, c.get(OVERRIDE_COOKIE)?.value, c.get('ff_locale_currency')?.value)
}
