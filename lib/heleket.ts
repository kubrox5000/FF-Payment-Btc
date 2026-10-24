import 'server-only'
import { db } from '@/db'
import { orders } from '@/db/schemas'
import { and, eq, inArray } from 'drizzle-orm'
import { heleketJson, heleketSign, invoiceMatches, invoicePaid, validHeleketUrl } from './heleket-protocol'

function env(name: string): string | undefined {
  const runtime = globalThis as typeof globalThis & { Netlify?: { env: { get: (key: string) => string | undefined } } }
  return runtime.Netlify?.env.get(name) ?? process.env[name]
}

export function heleketConfigured(): boolean {
  return Boolean(env('HELEKET_MERCHANT_ID') && env('HELEKET_API_KEY'))
}

export function heleketApiKey(): string {
  const key = env('HELEKET_API_KEY')
  if (!key) throw new Error('Payment service unavailable')
  return key
}

export async function heleketRequest(path: 'payment' | 'payment/info', data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const merchant = env('HELEKET_MERCHANT_ID')
  if (!merchant) throw new Error('Payment service unavailable')
  const body = heleketJson(data)
  const response = await fetch(`https://api.heleket.com/v1/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', merchant, sign: heleketSign(body, heleketApiKey()) },
    body, cache: 'no-store', signal: AbortSignal.timeout(15000),
  })
  const json = await response.json()
  if (!response.ok || json.state !== 0 || !json.result || typeof json.result !== 'object') throw new Error('Payment service unavailable')
  return json.result
}

export function heleketOrigin(): string {
  const origin = new URL(env('HELEKET_SITE_URL') || 'https://preeminent-lebkuchen-53c12e.netlify.app')
  if (origin.protocol !== 'https:') throw new Error('HTTPS payment callback required')
  return origin.origin
}

export async function createHeleketInvoice(order: typeof orders.$inferSelect): Promise<string> {
  const origin = heleketOrigin()
  const result = await heleketRequest('payment', {
    amount: order.amountUsd, currency: 'USD', order_id: order.orderNumber,
    url_callback: `${origin}/api/payments/heleket/webhook`,
    url_return: `${origin}/payment/${order.orderNumber}`,
    url_success: `${origin}/payment/${order.orderNumber}`,
    lifetime: 1800, accuracy_payment_percent: 0, subtract: 0, is_payment_multiple: true,
    is_refresh: true,
  })
  if (!invoiceMatches(result, order) || !validHeleketUrl(result.url)) throw new Error('Invalid invoice')
  // HELEKET orders reuse walletAddress for the hosted URL and txId for the
  // immutable invoice UUID. Legacy orders retain their original field meanings.
  await db.update(orders).set({ walletAddress: result.url, txId: String(result.uuid), updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.paymentMethod, 'HELEKET'), eq(orders.status, 'pending_payment')))
  return result.url
}

export async function reconcileHeleketOrder(order: typeof orders.$inferSelect) {
  if (order.paymentMethod !== 'HELEKET' || !order.txId || !['pending_payment', 'payment_review'].includes(order.status)) return order
  const invoice = await heleketRequest('payment/info', { uuid: order.txId })
  if (!invoiceMatches(invoice, order)) throw new Error('Invoice mismatch')
  if (!invoicePaid(invoice)) return order
  const [updated] = await db.update(orders).set({ status: 'paid', updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.txId, order.txId), inArray(orders.status, ['pending_payment', 'payment_review'])))
    .returning()
  return updated ?? (await db.select().from(orders).where(eq(orders.id, order.id)).limit(1))[0] ?? order
}
