import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import { heleketApiKey, heleketConfigured, reconcileHeleketOrder } from '@/lib/heleket'
import { verifyHeleketWebhook } from '@/lib/heleket-protocol'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!heleketConfigured()) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  const raw = await req.text()
  if (raw.length > 65536) return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(raw)
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') throw new Error()
  } catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }) }
  if (!verifyHeleketWebhook(payload, heleketApiKey())) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  if (payload.type !== 'payment' || typeof payload.order_id !== 'string' || typeof payload.uuid !== 'string') {
    return NextResponse.json({ error: 'Invalid invoice' }, { status: 400 })
  }
  try {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, payload.order_id)).limit(1)
    if (!order || order.paymentMethod !== 'HELEKET') return NextResponse.json({ error: 'Unknown order' }, { status: 404 })
    if (!order.txId) return NextResponse.json({ error: 'Invoice not saved yet' }, { status: 503 })
    if (order.txId !== payload.uuid) return NextResponse.json({ error: 'Invoice mismatch' }, { status: 400 })
    await reconcileHeleketOrder(order)
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Please retry callback' }, { status: 503 }) }
}
