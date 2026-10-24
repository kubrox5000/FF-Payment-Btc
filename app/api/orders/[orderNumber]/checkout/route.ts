import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import { createHeleketInvoice, heleketConfigured, reconcileHeleketOrder } from '@/lib/heleket'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!heleketConfigured()) return NextResponse.json({ error: 'Payment service is not available yet.' }, { status: 503 })
  const { orderNumber } = await params
  try {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.paymentMethod !== 'HELEKET' || order.status !== 'pending_payment') {
      return NextResponse.json({ error: 'This order cannot be paid through checkout.' }, { status: 409 })
    }
    const current = await reconcileHeleketOrder(order)
    if (current.status !== 'pending_payment') {
      return NextResponse.json({ error: 'Payment is already confirmed. Refresh the order status.' }, { status: 409 })
    }
    return NextResponse.json({ url: await createHeleketInvoice(order) })
  } catch {
    return NextResponse.json({ error: 'Unable to open Heleket. Please retry this order shortly.' }, { status: 502 })
  }
}
