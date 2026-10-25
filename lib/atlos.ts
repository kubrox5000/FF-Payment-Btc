import 'server-only'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { db } from '@/db'
import { orders, type Order } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import type { PublicPaymentMethod } from '@/lib/types'

// Atlos.io crypto payment gateway (https://atlos.io).
// Requires ATLOS_MERCHANT_ID (or NEXT_PUBLIC_ATLOS_MERCHANT_ID) and optional ATLOS_API_SECRET.

export const ATLOS_KEY = 'ATLOS'

export interface AtlosCredentials {
  merchantId?: string
  apiSecret?: string
}

export function getAtlosCredentials(): AtlosCredentials {
  let merchantId =
    process.env.ATLOS_MERCHANT_ID?.trim() ||
    process.env.NEXT_PUBLIC_ATLOS_MERCHANT_ID?.trim()
  let apiSecret = process.env.ATLOS_API_SECRET?.trim()

  if (!merchantId) {
    try {
      const envPath = path.join(process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8')
        const mMatch = content.match(/^ATLOS_MERCHANT_ID=(.+)$/m) || content.match(/^NEXT_PUBLIC_ATLOS_MERCHANT_ID=(.+)$/m)
        const sMatch = content.match(/^ATLOS_API_SECRET=(.+)$/m)
        if (mMatch) merchantId = mMatch[1].trim()
        if (sMatch) apiSecret = sMatch[1].trim()
        if (merchantId) process.env.ATLOS_MERCHANT_ID = merchantId
        if (apiSecret) process.env.ATLOS_API_SECRET = apiSecret
      }
    } catch {
      // ignore
    }
  }

  return { merchantId, apiSecret }
}

export function isAtlosConfigured(): boolean {
  const { merchantId } = getAtlosCredentials()
  return Boolean(merchantId)
}

// Verify Atlos webhook signature if ATLOS_API_SECRET is configured
export function verifyAtlosWebhook(
  rawBody: string,
  signatureHeader?: string | null,
  timestampHeader?: string | null,
): boolean {
  const { apiSecret } = getAtlosCredentials()
  if (!apiSecret) {
    // If no secret configured, accept webhook
    return true
  }

  if (!signatureHeader) return false

  try {
    const message = timestampHeader ? `${timestampHeader}.${rawBody}` : rawBody
    const expected = crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex')

    return (
      expected.length === signatureHeader.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
    )
  } catch {
    return false
  }
}

// Synchronize and mark Atlos order as paid
export async function markAtlosOrderPaid(orderNumber: string, txId?: string): Promise<Order | null> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1)

  if (!order) return null

  if (order.status === 'paid' || order.status === 'completed') {
    return order
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: 'paid',
      txId: txId || order.txId,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id))
    .returning()

  return updated ?? order
}

// Add Atlos to the store's payment methods when configured
export function withAtlos(methods: PublicPaymentMethod[]): PublicPaymentMethod[] {
  if (!isAtlosConfigured() || methods.some((m) => m.key === ATLOS_KEY)) return methods
  return [
    {
      id: 0,
      key: ATLOS_KEY,
      label: 'Atlos (Crypto)',
      network: 'USDT · BTC · ETH · SOL · LTC…',
      cat: 'crypto',
      icon: 'atlos',
      walletAddress: '',
      active: true,
      sortOrder: -2,
    },
    ...methods,
  ]
}
