import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import { reconcileHeleketOrder } from '@/lib/heleket'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const order = (
    await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1)
  )[0]
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  try {
    const reconciled = await reconcileHeleketOrder(order)
    return NextResponse.json({ order: reconciled }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ order, verificationPending: true }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
