import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { heleketJson, heleketSign, verifyHeleketWebhook, invoiceMatches, invoicePaid, validHeleketUrl } from './heleket-protocol'

const fixtureKey = 'local-test-fixture'
const order = { orderNumber: 'FF-TEST-1', amountUsd: '12.50', txId: 'invoice-fixture' }
const invoice = { uuid: 'invoice-fixture', order_id: order.orderNumber, amount: '12.50000000', currency: 'USD', payer_amount: '12.5', payment_amount: '12.50000000', is_final: true, payment_status: 'paid' }

test('signing matches Heleket PHP serialization including slashes and Unicode', () => {
  const data = { url: 'https://example.com/تأكيد' }
  const serialized = '{"url":"https:\\/\\/example.com\\/تأكيد"}'
  assert.equal(heleketJson(data), serialized)
  assert.equal(heleketSign(serialized, fixtureKey), createHash('md5').update(Buffer.from(serialized).toString('base64') + fixtureKey).digest('hex'))
})

test('webhook signature rejects tampering, missing signatures, and wrong keys', () => {
  const payload = { type: 'payment', ...invoice }
  const signed = { ...payload, sign: heleketSign(heleketJson(payload), fixtureKey) }
  assert.equal(verifyHeleketWebhook(signed, fixtureKey), true)
  assert.equal(verifyHeleketWebhook({ ...signed, amount: '0.01' }, fixtureKey), false)
  assert.equal(verifyHeleketWebhook(signed, 'incorrect-fixture'), false)
  assert.equal(verifyHeleketWebhook(payload, fixtureKey), false)
  assert.equal(verifyHeleketWebhook({ ...signed, sign: 'zz'.repeat(16) }, fixtureKey), false)
})

test('invoice must match saved order, UUID, currency, and exact amount', () => {
  assert.equal(invoiceMatches(invoice, order), true)
  for (const change of [{ order_id: 'another-order' }, { uuid: 'another-invoice' }, { currency: 'USDT' }, { amount: '12.49' }, { amount: 'not-money' }]) {
    assert.equal(invoiceMatches({ ...invoice, ...change }, order), false)
  }
})

test('only fully paid final invoices can confirm an order', () => {
  assert.equal(invoicePaid(invoice), true)
  assert.equal(invoicePaid({ ...invoice, payment_status: 'paid_over', payment_amount: '13' }), true)
  for (const status of ['check', 'confirm_check', 'wrong_amount', 'wrong_amount_waiting', 'cancel', 'fail', 'refund_paid', 'locked']) {
    assert.equal(invoicePaid({ ...invoice, payment_status: status }), false)
  }
  assert.equal(invoicePaid({ ...invoice, is_final: false }), false)
  assert.equal(invoicePaid({ ...invoice, payment_amount: '12.499999999999999999' }), false)
  assert.equal(invoicePaid({ ...invoice, payment_amount: null }), false)
  assert.equal(invoicePaid({ ...invoice, payer_amount: '0' }), false)
})

test('checkout redirect accepts only HTTPS Heleket origins', () => {
  assert.equal(validHeleketUrl('https://new-pay.heleket.com/pay/fixture'), true)
  for (const url of ['https://heleket.com.evil.test/pay', 'https://evilheleket.com/pay', 'http://pay.heleket.com/pay', 'javascript:alert(1)', 'https://name@pay.heleket.com/pay']) {
    assert.equal(validHeleketUrl(url), false)
  }
})
