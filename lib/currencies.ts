// Client-safe country/locale/currency resolution.

import geography from './country-locales.json'

export type Lang = string
export const LANGUAGES: Record<string, { name: string; label: string }> = geography.languages
export const CURRENCY_OPTIONS: Record<string, { name: string; symbol: string }> = geography.currencies
export function isSupportedLang(lang: string): boolean {
  return Object.hasOwn(LANGUAGES, lang)
}
export function isSupportedCurrency(currency: string): boolean {
  return Object.hasOwn(CURRENCY_OPTIONS, currency)
}
export type Dir = 'ltr' | 'rtl'

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  /** Fixed conversion rate: 1 USD = rate × local currency. */
  rate: number
}

export interface LocaleConfig {
  lang: Lang
  currency: string
}

export const dirOf = (lang: Lang): Dir => (['ar', 'ur', 'fa', 'he', 'ps', 'dv', 'yi'].includes(lang) ? 'rtl' : 'ltr')

// Fixed, editable conversion rates (USD → local). Prices shown to the visitor
// are computed as `priceUsd × rate` and never alter the real USDT/USD order amount.
export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م', rate: 48 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 3.75 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  IQD: { code: 'IQD', name: 'Iraqi Dinar', symbol: 'د.ع', rate: 1480 },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م', rate: 10.2 },
  DZD: { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', rate: 134 },
  TND: { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', rate: 3.1 },
  JOD: { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.أ', rate: 0.71 },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 0.31 },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', rate: 3.64 },
  BHD: { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', rate: 0.38 },
  OMR: { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع', rate: 0.386 },
  LYD: { code: 'LYD', name: 'Libyan Dinar', symbol: 'د.ل', rate: 4.85 },
  LBP: { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', rate: 89000 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 280 },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 16200 },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 58 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.1 },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 34.5 },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1500 },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 34 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.3 },
}

const COUNTRY_LOCALE: Record<string, { lang: string; languages: string[]; currency: string }> = geography.countries

export const FALLBACK_LOCALE: LocaleConfig = { lang: 'en', currency: 'USD' }

// Timezone → country. A fast, network-free signal for the visitor's physical
// location (more reliable than browser language, which is often left in English).
const TIMEZONE_COUNTRY: Record<string, string> = {
  'Africa/Casablanca': 'MA',
  'Africa/El_Aaiun': 'MA',
  'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  'Africa/Tripoli': 'LY',
  'Africa/Cairo': 'EG',
  'Africa/Khartoum': 'SD',
  'Africa/Djibouti': 'DJ',
  'Africa/Mogadishu': 'SO',
  'Africa/Nouakchott': 'MR',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Asia/Kuwait': 'KW',
  'Asia/Baghdad': 'IQ',
  'Asia/Dubai': 'AE',
  'Asia/Amman': 'JO',
  'Asia/Beirut': 'LB',
  'Asia/Damascus': 'SY',
  'Asia/Muscat': 'OM',
  'Asia/Bahrain': 'BH',
  'Asia/Jerusalem': 'PS',
  'Asia/Aden': 'YE',
}

/** Resolve a country code from the browser timezone, if one is known. */
export function countryFromTimezone(timeZone?: string): string | undefined {
  if (!timeZone) return undefined
  return TIMEZONE_COUNTRY[timeZone]
}

/** Prefer the country's language, or a browser language used in that country. */
export function localeForCountry(countryCode: string | undefined, preferredLanguages: string[] = []): LocaleConfig {
  const country = COUNTRY_LOCALE[(countryCode ?? '').trim().toUpperCase()]
  if (!country) return { ...FALLBACK_LOCALE }
  const preferred = preferredLanguages.map(tag => tag.toLowerCase().split('-')[0])
  return { lang: preferred.find(lang => country.languages.includes(lang)) ?? country.lang, currency: country.currency }
}

export function countryFromLanguageTags(tags: string[]): string | undefined {
  for (const tag of tags) {
    try {
      const region = new Intl.Locale(tag).region
      if (region && COUNTRY_LOCALE[region]) return region
    } catch { /* Skip invalid browser language tags. */ }
  }
  return undefined
}

/** A "generic" interface used by the provider before a final decision. */
export interface LocaleState {
  status: 'loading' | 'ready'
  lang: Lang
  dir: Dir
  currency: string
}

/** Format a number using Latin (Western) digits with standard grouping. */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
}

/** Local display only; the actual order/payment amount stays in USD/USDT. */
export function formatLocalPrice(usd: number, lang: Lang, currency: string, rates: Record<string, number> = {}): string {
  const rate = rates[currency] ?? CURRENCIES[currency]?.rate
  const displayCurrency = rate && rate > 0 ? currency : 'USD'
  return new Intl.NumberFormat(lang, { style: 'currency', currency: displayCurrency }).format(usd * (rate && rate > 0 ? rate : 1))
}
