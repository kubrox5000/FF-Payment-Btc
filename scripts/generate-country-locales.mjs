import countries from 'world-countries'
import { iso6393 } from 'iso-639-3'
import { writeFileSync } from 'node:fs'

const languageCodes = Object.fromEntries(iso6393.filter(l => l.iso6391).map(l => [l.iso6393, l.iso6391]))
const defaults = { IN: 'hi', PK: 'ur', BD: 'bn', LK: 'si', NP: 'ne', ZA: 'en', CH: 'de', BE: 'nl', CA: 'en', SG: 'en', IE: 'en', NZ: 'en', PH: 'fil', HK: 'zh', TW: 'zh', MO: 'zh', LU: 'fr', DJ: 'ar', SO: 'so', MR: 'ar', TD: 'ar' }
const locales = {}
const currencies = { USD: { name: 'US Dollar', symbol: '$' } }
for (const country of countries) {
  const languages = [...new Set(Object.keys(country.languages ?? {}).map(code => languageCodes[code]).filter(Boolean))]
  const lang = defaults[country.cca2] ?? languages[0] ?? 'en'
  locales[country.cca2] = { lang, languages: [...new Set([lang, ...languages])], currency: Object.keys(country.currencies ?? {})[0] ?? 'USD' }
  Object.assign(currencies, country.currencies)
}
const languageSet = new Set(['ar', 'en', 'fr', 'es', ...Object.values(locales).flatMap(c => c.languages)])
const names = new Intl.DisplayNames(['en'], { type: 'language' })
const languages = Object.fromEntries([...languageSet].sort().map(code => [code, { name: names.of(code), label: new Intl.DisplayNames([code], { type: 'language' }).of(code) }]))
writeFileSync('lib/country-locales.json', JSON.stringify({ countries: locales, currencies, languages }, null, 2) + '\n')
console.log(`Generated ${countries.length} countries, ${Object.keys(currencies).length} currencies, ${languageSet.size} languages`)
