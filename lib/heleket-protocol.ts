import { createHash, timingSafeEqual } from 'node:crypto'

export function heleketJson(data: unknown): string {
  return JSON.stringify(data).replace(/\//g, '\\/')
}

export function heleketSign(body: string, apiKey: string): string {
  return createHash('md5').update(Buffer.from(body).toString('base64') + apiKey).digest('hex')
}

export function verifyHeleketWebhook(payload: Record<string, unknown>, apiKey: string): boolean {
  const { sign, ...data } = payload
  if (typeof sign !== 'string' || !/^[a-f0-9]{32}$/i.test(sign)) return false
  return timingSafeEqual(Buffer.from(sign, 'hex'), Buffer.from(heleketSign(heleketJson(data), apiKey), 'hex'))
}

function decimal(value: unknown): bigint | null {
  if (typeof value !== 'string' || !/^\d{1,20}(\.\d{1,18})?$/.test(value)) return null
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole + fraction.padEnd(18, '0'))
}

export function validHeleketUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password &&
      (url.hostname === 'heleket.com' || url.hostname.endsWith('.heleket.com')) && !url.port
  } catch { return false }
}

export function invoiceMatches(invoice: Record<string, unknown>, order: { orderNumber: string; amountUsd: string; txId: string | null }): boolean {
  const expected = decimal(order.amountUsd)
  return invoice.order_id === order.orderNumber && typeof invoice.uuid === 'string' &&
    (!order.txId || invoice.uuid === order.txId) && invoice.currency === 'USD' &&
    expected !== null && expected > BigInt(0) && decimal(invoice.amount) === expected
}

export function invoicePaid(invoice: Record<string, unknown>): boolean {
  const due = decimal(invoice.payer_amount)
  const received = decimal(invoice.payment_amount)
  return ['paid', 'paid_over'].includes(String(invoice.payment_status ?? invoice.status)) &&
    invoice.is_final === true && due !== null && due > BigInt(0) && received !== null && received >= due
}
