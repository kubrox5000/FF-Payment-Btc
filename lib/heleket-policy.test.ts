import test from 'node:test'
import assert from 'node:assert/strict'
import { applyHeleketAvailability } from './heleket-policy'
import type { PublicPaymentMethod } from './types'

const manual: PublicPaymentMethod = {
  id: 1, key: 'BTC', label: 'Bitcoin', network: 'Bitcoin', cat: 'crypto',
  icon: 'btc', walletAddress: '', active: true, sortOrder: 1,
}

test('disabling Heleket removes even an active database entry without changing other methods', () => {
  const enabled = applyHeleketAvailability([manual], true)
  assert.equal(enabled[0].key, 'HELEKET')
  assert.deepEqual(applyHeleketAvailability(enabled, false), [manual])
  assert.equal(enabled.length, 2)
})

test('enabling without configured methods provides one gateway and never duplicates it', () => {
  const enabled = applyHeleketAvailability([], true)
  assert.equal(enabled.length, 1)
  assert.equal(enabled[0].key, 'HELEKET')
  assert.equal(enabled[0].active, true)
  assert.deepEqual(applyHeleketAvailability(enabled, true), enabled)
  assert.deepEqual(applyHeleketAvailability([], false), [])
})

test('an existing custom Heleket entry retains its label and position when enabled', () => {
  const gateway = { ...manual, id: 7, key: 'HELEKET', label: 'Custom gateway' }
  assert.deepEqual(applyHeleketAvailability([manual, gateway], true), [manual, gateway])
})
