// Client-safe country/locale/currency resolution.

export type Lang = 'en' | 'ar' | 'fr' | 'es'
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

export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr')

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

// Country → currency. Arabic is the official, always-on language of the site;
// the country mapping only adjusts the display currency so prices adapt to the
// visitor's region (SAR is the universal fallback).
const COUNTRY_LOCALE: Record<string, LocaleConfig> = {
  // MENA / Arabic-speaking
  SA: { lang: 'ar', currency: 'SAR' },
  AE: { lang: 'ar', currency: 'AED' },
  EG: { lang: 'ar', currency: 'EGP' },
  IQ: { lang: 'ar', currency: 'IQD' },
  MA: { lang: 'ar', currency: 'MAD' },
  DZ: { lang: 'ar', currency: 'DZD' },
  TN: { lang: 'ar', currency: 'TND' },
  JO: { lang: 'ar', currency: 'JOD' },
  KW: { lang: 'ar', currency: 'KWD' },
  QA: { lang: 'ar', currency: 'QAR' },
  BH: { lang: 'ar', currency: 'BHD' },
  OM: { lang: 'ar', currency: 'OMR' },
  LY: { lang: 'ar', currency: 'LYD' },
  LB: { lang: 'ar', currency: 'LBP' },
  SY: { lang: 'ar', currency: 'USD' },
  YE: { lang: 'ar', currency: 'USD' },
  PS: { lang: 'ar', currency: 'USD' },
  MR: { lang: 'ar', currency: 'USD' },
  SO: { lang: 'ar', currency: 'USD' },
  SD: { lang: 'ar', currency: 'USD' },
  DJ: { lang: 'ar', currency: 'USD' },
  // French-speaking countries
  CM: { lang: 'fr', currency: 'USD' },
  CI: { lang: 'fr', currency: 'USD' },
  SN: { lang: 'fr', currency: 'USD' },
  ML: { lang: 'fr', currency: 'USD' },
  // Spanish-speaking countries
  MX: { lang: 'es', currency: 'USD' },
  CO: { lang: 'es', currency: 'USD' },
  AR: { lang: 'es', currency: 'USD' },
  CL: { lang: 'es', currency: 'USD' },
  PE: { lang: 'es', currency: 'USD' },
  VE: { lang: 'es', currency: 'USD' },
  // Non-Arabic regions with local currency
  US: { lang: 'en', currency: 'USD' },
  GB: { lang: 'en', currency: 'GBP' },
  IN: { lang: 'en', currency: 'INR' },
  PK: { lang: 'en', currency: 'PKR' },
  ID: { lang: 'en', currency: 'IDR' },
  PH: { lang: 'en', currency: 'PHP' },
  BR: { lang: 'en', currency: 'BRL' },
  TR: { lang: 'en', currency: 'TRY' },
  NG: { lang: 'en', currency: 'NGN' },
  TH: { lang: 'en', currency: 'THB' },
  MY: { lang: 'en', currency: 'MYR' },
  DE: { lang: 'en', currency: 'EUR' },
  FR: { lang: 'fr', currency: 'EUR' },
  ES: { lang: 'es', currency: 'EUR' },
  IT: { lang: 'en', currency: 'EUR' },
  NL: { lang: 'en', currency: 'EUR' },
  BE: { lang: 'en', currency: 'EUR' },
  PT: { lang: 'en', currency: 'EUR' },
  AT: { lang: 'en', currency: 'EUR' },
  IE: { lang: 'en', currency: 'EUR' },
  FI: { lang: 'en', currency: 'EUR' },
  GR: { lang: 'en', currency: 'EUR' },
  RO: { lang: 'en', currency: 'EUR' },
  PL: { lang: 'en', currency: 'EUR' },
}

export const FALLBACK_LOCALE: LocaleConfig = { lang: 'ar', currency: 'SAR' }

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

/**
 * Map an ISO country code to the visitor's locale. Arabic is the official
 * language and is always returned regardless of country; only the currency is
 * adjusted per region (SAR as the universal fallback).
 */
export function localeForCountry(countryCode: string | undefined): LocaleConfig {
  const code = (countryCode ?? '').trim().toUpperCase()
  const currency = COUNTRY_LOCALE[code]?.currency ?? FALLBACK_LOCALE.currency
  return { lang: 'ar', currency }
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

/** Format a USD base price into the active display currency (whole number). */
export function formatLocalPrice(usd: number, lang: Lang, currency: string): string {
  const info = CURRENCIES[currency] ?? CURRENCIES.USD
  // Drop any fractional part so prices always show as whole numbers (203.9 → 203).
  const amount = Math.floor(usd * info.rate)
  // Keep Latin (Western) digits even in Arabic; only the currency symbol changes.
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  return `${nf.format(amount)} ${info.symbol}`
}