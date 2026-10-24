'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { dirOf, localeForCountry, formatLocalPrice, countryFromTimezone, countryFromLanguageTags, isSupportedCurrency, type Lang } from '@/lib/currencies'
import { t as translate, type TKey } from '@/lib/i18n'
import type { ServerLocale } from '@/lib/locale-server'
import type { LocaleBundle } from '@/lib/locale-bundle'

const OVERRIDE_KEY = 'ff_locale_lang'

export interface LocaleValue {
  status: 'loading' | 'ready'
  lang: Lang
  dir: 'ltr' | 'rtl'
  currency: string
  countryCode?: string
  t: (key: TKey, vars?: Record<string, string | number>) => string
  translateText: (text: string) => string
  formatPrice: (usd: number) => string
  countryName: (code: string, fallback?: string) => string
  setLang: (lang: Lang) => void
  setCurrency: (currency: string) => void
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function GeoLocaleProvider({ children, initialLocale, initialBundle }: {
  children: ReactNode
  initialLocale?: ServerLocale
  initialBundle?: LocaleBundle
}) {
  const [state, setState] = useState({
    status: 'ready' as 'loading' | 'ready',
    lang: initialBundle?.lang ?? initialLocale?.lang ?? 'en',
    currency: initialLocale?.currency ?? 'USD',
    countryCode: initialLocale?.countryCode,
    bundle: initialBundle,
  })
  const sequence = useRef(0)

  useEffect(() => {
    document.documentElement.lang = state.lang
    document.documentElement.dir = dirOf(state.lang)
  }, [state.lang])

  const loadLanguage = useCallback(async (lang: string) => {
    const current = ++sequence.current
    setState(s => ({ ...s, status: 'loading' }))
    try {
      const response = await fetch(`/api/locale?lang=${encodeURIComponent(lang)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Locale unavailable')
      const { bundle } = await response.json() as { bundle: LocaleBundle }
      if (current === sequence.current) setState(s => ({ ...s, lang: bundle.lang, bundle, status: 'ready' }))
    } catch {
      if (current === sequence.current) setState(s => ({ ...s, status: 'ready' }))
    }
  }, [])

  useEffect(() => {
    // Never overwrite accurate network geolocation with the device's timezone.
    if (initialLocale?.countryDetected) return
    const preferences = [...navigator.languages]
    const countryCode = countryFromLanguageTags(preferences)
      ?? countryFromTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    if (!countryCode) return
    const locale = localeForCountry(countryCode, preferences)
    const hasLanguageOverride = document.cookie.split('; ').some(cookie => cookie.startsWith(`${OVERRIDE_KEY}=`))
    const hasCurrencyOverride = document.cookie.split('; ').some(cookie => cookie.startsWith('ff_locale_currency='))
    setState(s => ({ ...s, countryCode, currency: hasCurrencyOverride ? s.currency : locale.currency }))
    if (!hasLanguageOverride && locale.lang !== initialLocale?.lang) void loadLanguage(locale.lang)
  }, [initialLocale?.countryDetected, initialLocale?.lang, loadLanguage])

  const setLang = useCallback((lang: Lang) => {
    document.cookie = `${OVERRIDE_KEY}=${encodeURIComponent(lang)}; path=/; max-age=31536000; samesite=lax`
    void loadLanguage(lang)
  }, [loadLanguage])

  const setCurrency = useCallback((currency: string) => {
    if (!isSupportedCurrency(currency)) return
    document.cookie = `ff_locale_currency=${currency}; path=/; max-age=31536000; samesite=lax`
    setState(s => ({ ...s, currency }))
  }, [])

  const value = useMemo<LocaleValue>(() => ({
    status: state.status,
    lang: state.lang,
    dir: dirOf(state.lang),
    currency: state.currency,
    countryCode: state.countryCode,
    t: (key, vars) => translate(state.lang, key, vars, state.bundle?.messages),
    translateText: text => state.bundle?.texts[text] ?? text,
    formatPrice: usd => formatLocalPrice(usd, state.lang, state.currency, state.bundle?.rates),
    countryName: (code, fallback) => {
      try { return new Intl.DisplayNames([state.lang], { type: 'region' }).of(code) ?? fallback ?? code }
      catch { return fallback ?? code }
    },
    setLang,
    setCurrency,
  }), [state, setLang, setCurrency])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within <GeoLocaleProvider>')
  return ctx
}
