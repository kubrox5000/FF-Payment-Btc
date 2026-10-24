import { countryFromLanguageTags, isSupportedCurrency, isSupportedLang, localeForCountry } from './currencies'

export function detectLocale(headers: Headers, languageOverride?: string, currencyOverride?: string) {
  const preferences = (headers.get('accept-language') ?? '').split(',')
    .map(item => { const [tag, weight] = item.trim().split(';q='); return { tag, q: weight ? Number(weight) : 1 } })
    .filter(item => item.q > 0).sort((a, b) => b.q - a.q).map(item => item.tag)
  // Next.js on Netlify also receives x-nf-geo, covering the first render even
  // when the framework's edge middleware executes before custom edge functions.
  let netlifyCountry: string | undefined
  try {
    const raw = headers.get('x-nf-geo')
    if (raw) netlifyCountry = JSON.parse(atob(raw)).country?.code
  } catch { /* A missing geo signal falls back to browser region. */ }
  const geo = headers.get('x-visitor-country') ?? netlifyCountry ?? headers.get('cf-ipcountry')
  const countryCode = geo && /^[a-z]{2}$/i.test(geo) && geo !== 'XX'
    ? geo.toUpperCase() : countryFromLanguageTags(preferences)
  const base = localeForCountry(countryCode, preferences)
  const browserLang = preferences.map(tag => tag.toLowerCase().split('-')[0]).find(isSupportedLang)
  return {
    lang: languageOverride && isSupportedLang(languageOverride) ? languageOverride : countryCode ? base.lang : browserLang ?? base.lang,
    currency: currencyOverride && isSupportedCurrency(currencyOverride) ? currencyOverride : base.currency,
    countryCode,
    countryDetected: Boolean(geo && countryCode),
  }
}
