'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  dirOf,
  localeForCountry,
  formatLocalPrice,
  countryFromTimezone,
  type Lang,
} from '@/lib/currencies'
import { LANGUAGE_COOKIE, CURRENCY_COOKIE, validLang, validCurrency, validCountry } from '@/lib/visitor-locale'
import { t as translate, type TKey } from '@/lib/i18n'
import type { ServerLocale } from '@/lib/locale-server'

const OVERRIDE_KEY = LANGUAGE_COOKIE

export interface LocaleValue {
  status: 'loading' | 'ready'
  lang: Lang
  dir: 'ltr' | 'rtl'
  currency: string
  countryCode?: string
  t: (key: TKey, vars?: Record<string, string | number>) => string
  formatPrice: (usd: number) => string
  /** Manually override the language (keeps the detected currency). */
  setLang: (lang: Lang) => void
  /** Manually override the display currency. */
  setCurrency: (currency: string) => void
}

const LocaleContext = createContext<LocaleValue | null>(null)

interface State {
  status: 'loading' | 'ready'
  lang: Lang
  currency: string
  countryCode?: string
}

export function GeoLocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: ServerLocale
}) {
  const seeded = useRef(initialLocale)
  const manualLang = useRef<Lang | undefined>(undefined)
  const manualCurrency = useRef<string | undefined>(undefined)
  const [state, setState] = useState<State>({
    status: seeded.current ? 'ready' : 'loading',
    lang: seeded.current?.lang ?? 'en',
    currency: seeded.current?.currency ?? 'USD',
    countryCode: seeded.current?.countryCode,
  })

  // Keep <html lang> and <html dir> in sync with the active language.
  useEffect(() => {
    document.documentElement.setAttribute('lang', state.lang)
    document.documentElement.setAttribute('dir', dirOf(state.lang))
  }, [state.lang])

  // Netlify geo data is authoritative. Browser hints are used only locally or
  // when the hosting platform cannot identify the visitor's country.
  useEffect(() => {
    const readPreference = (key: string) => {
      const cookie = document.cookie.split('; ').find((part) => part.startsWith(`${key}=`))?.slice(key.length + 1)
      if (cookie) return cookie
      try { return localStorage.getItem(key) } catch { return undefined }
    }
    manualLang.current = validLang(readPreference(LANGUAGE_COOKIE))
    manualCurrency.current = validCurrency(readPreference(CURRENCY_COOKIE))
    // Migrate preferences saved by the previous client-only implementation.
    if (manualLang.current) document.cookie = `${LANGUAGE_COOKIE}=${manualLang.current}; path=/; max-age=31536000; samesite=lax`
    if (manualCurrency.current) document.cookie = `${CURRENCY_COOKIE}=${manualCurrency.current}; path=/; max-age=31536000; samesite=lax`

    let countryCode = seeded.current?.countryCode
    if (!countryCode) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const region = navigator.languages.map((language) => {
        try { return validCountry(new Intl.Locale(language).region) } catch { return undefined }
      }).find(Boolean)
      countryCode = countryFromTimezone(timezone) ?? region
    }
    const base = countryCode ? localeForCountry(countryCode) : seeded.current
    const browserLang = navigator.languages.map((language) => validLang(language.split('-')[0])).find(Boolean)
    setState((s) => ({
      ...s,
      status: 'ready',
      countryCode,
      lang: manualLang.current ?? (countryCode ? base?.lang : browserLang) ?? base?.lang ?? s.lang,
      currency: manualCurrency.current ?? base?.currency ?? s.currency,
    }))
  }, [])

  const setLang = useCallback((lang: Lang) => {
    manualLang.current = lang
    document.cookie = `${OVERRIDE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`
    try {
      globalThis.localStorage?.setItem(OVERRIDE_KEY, lang)
    } catch {
      // ignore storage errors
    }
    setState((s) => ({ ...s, lang }))
  }, [])

  const setCurrency = useCallback((currency: string) => {
    if (!validCurrency(currency)) return
    manualCurrency.current = currency
    document.cookie = `${CURRENCY_COOKIE}=${currency}; path=/; max-age=31536000; samesite=lax`
    try {
      globalThis.localStorage?.setItem('ff_locale_currency', currency)
    } catch {
      // ignore storage errors
    }
    setState((s) => ({ ...s, currency }))
  }, [])

  const value = useMemo<LocaleValue>(() => {
    return {
      status: state.status,
      lang: state.lang,
      dir: dirOf(state.lang),
      currency: state.currency,
      countryCode: state.countryCode,
      t: (key, vars) => translate(state.lang, key, vars),
      formatPrice: (usd) => formatLocalPrice(usd, state.lang, state.currency),
      setLang,
      setCurrency,
    }
  }, [state, setLang, setCurrency])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within <GeoLocaleProvider>')
  return ctx
}
