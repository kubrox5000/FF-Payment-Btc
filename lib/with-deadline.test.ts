import assert from 'node:assert/strict'
import test from 'node:test'
import { withDeadline } from './with-deadline'

test('returns cached data when the read completes promptly', async () => {
  assert.equal(await withDeadline(Promise.resolve('cached'), 100, 'fallback'), 'cached')
})

test('returns fallback when optional work stalls', async () => {
  const stalled = new Promise<string>(() => {})
  assert.equal(await withDeadline(stalled, 10, 'fallback'), 'fallback')
})

test('returns fallback when the cache read rejects', async () => {
  assert.equal(await withDeadline(Promise.reject(new Error('offline')), 100, 'fallback'), 'fallback')
})

test('handles rejection after the deadline without an unhandled rejection', async () => {
  const late = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('late')), 20))
  assert.equal(await withDeadline(late, 5, 'fallback'), 'fallback')
  await new Promise(resolve => setTimeout(resolve, 30))
})
