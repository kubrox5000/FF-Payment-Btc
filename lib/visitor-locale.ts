import { CURRENCIES, localeForCountry, type Lang } from './currencies'

export const LANGUAGE_COOKIE = 'ff_locale_lang'
export const CURRENCY_COOKIE = 'ff_locale_currency'

export function validLang(value?: string | null): Lang | undefined {
  return value === 'ar' || value === 'en' || value === 'fr' || value === 'es' ? value : undefined
}

export function validCurrency(value?: string | null): string | undefined {
  return value && Object.hasOwn(CURRENCIES, value) ? value : undefined
}

export function validCountry(value?: string | null): string | undefined {
  const code = value?.trim().toUpperCase()
  return code && /^[A-Z]{2}$/.test(code) && code !== 'XX' ? code : undefined
}

/** Netlify supplies base64-encoded geolocation on each incoming request. */
export function countryFromHeaders(headers: Pick<Headers, 'get'>): string | undefined {
  try {
    const geo = JSON.parse(atob(headers.get('x-nf-geo') ?? ''))
    const country = validCountry(geo.country?.code)
    if (country) return country
  } catch {
    // Local development and other hosts may not provide Netlify geolocation.
  }
  return validCountry(headers.get('cf-ipcountry'))
}

export function resolveVisitorLocale(countryCode?: string, language?: string | null, currency?: string | null) {
  const base = localeForCountry(countryCode)
  return {
    countryCode,
    lang: validLang(language) ?? base.lang,
    currency: validCurrency(currency) ?? base.currency,
  }
}
