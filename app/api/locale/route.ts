import { NextResponse } from 'next/server'
import { resolveServerLocale } from '@/lib/locale-server'
import { getLocaleBundle } from '@/lib/locale-content'
import { isSupportedLang } from '@/lib/currencies'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get('lang')
  if (requested && !isSupportedLang(requested)) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
  const locale = await resolveServerLocale()
  const bundle = await getLocaleBundle(requested ?? locale.lang)
  return NextResponse.json({ locale: { ...locale, lang: bundle.lang }, bundle }, { headers: { 'Cache-Control': 'private, no-store' } })
}
