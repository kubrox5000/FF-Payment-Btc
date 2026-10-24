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
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.37 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.65 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.9 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 150 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', rate: 7.2 },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1350 },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.8 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  TWD: { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', rate: 32 },
  VND: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 25000 },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', rate: 120 },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 300 },
  NPR: { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', rate: 133.6 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.5 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 130 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 15 },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 90 },
  UAH: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', rate: 41 },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 4 },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', rate: 4.6 },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 23 },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 360 },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.5 },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.7 },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.87 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 18 },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: 'CO$', rate: 4000 },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', rate: 1000 },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$', rate: 950 },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', rate: 3.75 },
  UYU: { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', rate: 40 },
  BOB: { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs', rate: 6.91 },
  PYG: { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', rate: 7500 },
  XOF: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', rate: 603.7 },
  XAF: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', rate: 603.7 },
  XPF: { code: 'XPF', name: 'CFP Franc', symbol: '₣', rate: 109.8 },
  MUR: { code: 'MUR', name: 'Mauritian Rupee', symbol: 'Rs', rate: 46 },
  MGA: { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', rate: 4500 },
  CDF: { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', rate: 2800 },
  RWF: { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', rate: 1400 },
  BIF: { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', rate: 2900 },
  HTG: { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', rate: 132 },
  DJF: { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', rate: 177.72 },
  MRU: { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', rate: 40 },
  SOS: { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh', rate: 571 },
  SDG: { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س', rate: 600 },
  YER: { code: 'YER', name: 'Yemeni Rial', symbol: 'ر.ي', rate: 250 },
  SYP: { code: 'SYP', name: 'Syrian Pound', symbol: 'ل.س', rate: 13000 },
  ILS: { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', rate: 3.7 },
  KMF: { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', rate: 452.6 },
  ISK: { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', rate: 138 },
  GTQ: { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', rate: 7.8 },
  HNL: { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', rate: 25 },
  NIO: { code: 'NIO', name: 'Nicaraguan Cordoba', symbol: 'C$', rate: 36.6 },
  CRC: { code: 'CRC', name: 'Costa Rican Colon', symbol: '₡', rate: 510 },
  DOP: { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', rate: 60 },
  CUP: { code: 'CUP', name: 'Cuban Peso', symbol: '₱', rate: 24 },

}

// Country defaults use the available translations; other languages fall back to English.
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


// Currency groups also cover territories sharing a currency.
const CURRENCY_COUNTRIES: Record<string, string> = {
  CAD: 'CA',
  AUD: 'AU CX CC NF',
  NZD: 'NZ CK NU PN TK',
  CHF: 'CH LI',
  JPY: 'JP',
  CNY: 'CN',
  KRW: 'KR',
  HKD: 'HK',
  SGD: 'SG',
  TWD: 'TW',
  VND: 'VN',
  BDT: 'BD',
  LKR: 'LK',
  NPR: 'NP',
  ZAR: 'ZA LS NA',
  KES: 'KE',
  GHS: 'GH',
  RUB: 'RU',
  UAH: 'UA',
  PLN: 'PL',
  RON: 'RO',
  CZK: 'CZ',
  HUF: 'HU',
  SEK: 'SE',
  NOK: 'NO SJ BV',
  DKK: 'DK FO GL',
  MXN: 'MX',
  COP: 'CO',
  ARS: 'AR',
  CLP: 'CL',
  PEN: 'PE',
  UYU: 'UY',
  BOB: 'BO',
  PYG: 'PY',
  XOF: 'BJ BF CI GW ML NE SN TG',
  XAF: 'CM CF TD CG GQ GA',
  XPF: 'PF NC WF',
  MUR: 'MU',
  MGA: 'MG',
  CDF: 'CD',
  RWF: 'RW',
  BIF: 'BI',
  HTG: 'HT',
  DJF: 'DJ',
  MRU: 'MR',
  SOS: 'SO',
  SDG: 'SD',
  YER: 'YE',
  SYP: 'SY',
  ILS: 'IL PS',
  KMF: 'KM',
  ISK: 'IS',
  GTQ: 'GT',
  HNL: 'HN',
  NIO: 'NI',
  CRC: 'CR',
  DOP: 'DO',
  CUP: 'CU',
  EUR: 'AD AT AX BE BL CY DE EE ES FI FR GF GP GR HR IE IT LT LU LV MC ME MF MQ MT NL PM PT RE SI SK SM TF VA YT',
  USD: 'US AS BQ EC FM GU IO MH MP PA PR PW SV TC TL UM VG VI',
}
for (const [currency, countries] of Object.entries(CURRENCY_COUNTRIES)) {
  for (const country of countries.split(' ')) {
    COUNTRY_LOCALE[country] = { lang: COUNTRY_LOCALE[country]?.lang ?? 'en', currency }
  }
}
for (const country of 'FR BE LU MC CH BJ BF BI CD CF CG CI CM DJ GA GN HT MG ML MU NE RE RW SN TD TG YT PF NC WF'.split(' ')) {
  COUNTRY_LOCALE[country] = { lang: 'fr', currency: COUNTRY_LOCALE[country]?.currency ?? 'USD' }
}
for (const country of 'ES MX CO AR CL PE VE UY BO PY EC PA CR CU DO GT HN NI SV GQ PR'.split(' ')) {
  COUNTRY_LOCALE[country] = { lang: 'es', currency: COUNTRY_LOCALE[country]?.currency ?? 'USD' }
}
COUNTRY_LOCALE.KM = { lang: 'ar', currency: 'KMF' }

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

/** Resolve country defaults, with English/USD for unsupported regions. */
export function localeForCountry(countryCode: string | undefined): LocaleConfig {
  const code = (countryCode ?? '').trim().toUpperCase()
  return { ...(COUNTRY_LOCALE[code] ?? FALLBACK_LOCALE) }
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