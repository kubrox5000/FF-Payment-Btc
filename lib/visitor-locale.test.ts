import test from 'node:test'
import assert from 'node:assert/strict'
import { countryFromHeaders, resolveVisitorLocale, validCurrency } from './visitor-locale'
import { localeForCountry, CURRENCIES } from './currencies'

test('Netlify country takes priority over fallback host headers', () => {
  const headers = new Headers({
    'x-nf-geo': btoa(JSON.stringify({ country: { code: 'FR' } })),
    'cf-ipcountry': 'SA',
  })
  assert.equal(countryFromHeaders(headers), 'FR')
  assert.deepEqual(resolveVisitorLocale(countryFromHeaders(headers)), {
    countryCode: 'FR', lang: 'fr', currency: 'EUR',
  })
})

test('missing or malformed geo data safely falls back', () => {
  assert.equal(countryFromHeaders(new Headers()), undefined)
  assert.equal(countryFromHeaders(new Headers({ 'x-nf-geo': 'invalid' })), undefined)
  assert.equal(countryFromHeaders(new Headers({ 'cf-ipcountry': 'xx' })), undefined)
  assert.deepEqual(resolveVisitorLocale(), { countryCode: undefined, lang: 'en', currency: 'USD' })
})

test('country selects language and currency independently', () => {
  for (const [country, lang, currency] of [
    ['SA', 'ar', 'SAR'], ['EG', 'ar', 'EGP'], ['FR', 'fr', 'EUR'],
    ['MX', 'es', 'MXN'], ['CA', 'en', 'CAD'], ['JP', 'en', 'JPY'],
    ['SN', 'fr', 'XOF'], ['PL', 'en', 'PLN'], ['RO', 'en', 'RON'],
    ['AU', 'en', 'AUD'], ['ES', 'es', 'EUR'],
  ]) {
    assert.deepEqual(localeForCountry(country), { lang, currency })
    assert.ok(CURRENCIES[currency])
  }
  assert.deepEqual(localeForCountry(' fr '), { lang: 'fr', currency: 'EUR' })
})

test('manual preferences survive country changes and invalid values are ignored', () => {
  assert.deepEqual(resolveVisitorLocale('FR', 'ar', 'GBP'), {
    countryCode: 'FR', lang: 'ar', currency: 'GBP',
  })
  assert.deepEqual(resolveVisitorLocale('MX', 'invalid', 'invalid'), {
    countryCode: 'MX', lang: 'es', currency: 'MXN',
  })
  assert.equal(validCurrency('toString'), undefined)
})
