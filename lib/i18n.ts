import { en, type EnDict } from './locales/en'
import { ar } from './locales/ar'
import { fr } from './locales/fr'
import { es } from './locales/es'
import type { Lang } from './currencies'

// All language dictionaries share the same key shape as `en`.
export const dictionaries: Record<string, EnDict> = { en, ar, fr: fr as unknown as EnDict, es: es as unknown as EnDict }

export type TKey = keyof EnDict

export function t(
  lang: Lang,
  key: TKey,
  vars?: Record<string, string | number>,
  messages?: Record<string, string>,
): string {
  const template = (messages?.[key] ?? dictionaries[lang]?.[key] ?? dictionaries.en[key]) as string
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
}

export type Dictionary = EnDict
