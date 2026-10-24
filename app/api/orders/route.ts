import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { packages, orders, coupons } from '@/db/schemas'
import { eq, sql } from 'drizzle-orm'
import { generateOrderNumber, discountedPrice } from '@/lib/orders'
import { heleketConfigured } from '@/lib/heleket'

const createSchema = z.object({
  packageId: z.number().int().positive(),
  playerUid: z.string().min(4).max(32).regex(/^[0-9]+$/, 'UID must be numeric'),
  nickname: z.string().max(40).optional().nullable(),
  server: z.string().min(1).max(40),
  email: z.string().email().optional().nullable().or(z.literal('')),
  country: z.string().max(60).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  paymentMethod: z.literal('HELEKET'),
  couponCode: z.string().max(40).optional().nullable(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = parsed.data
  if (!heleketConfigured()) {
    return NextResponse.json({ error: 'Heleket payments are not available yet. Please try again later.' }, { status: 503 })
  }

  // Prices and discounts are resolved on the server.
  const couponCode = data.couponCode ? data.couponCode.trim().toUpperCase() : null

  const [pkgRows, couponRows] = await Promise.all([
    db.select().from(packages).where(eq(packages.id, data.packageId)).limit(1),
    couponCode
      ? db.select().from(coupons).where(eq(coupons.code, couponCode)).limit(1)
      : Promise.resolve([] as typeof coupons.$inferSelect[]),
  ])

  const pkg = pkgRows[0]
  if (!pkg || !pkg.active) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 })
  }

  // ── Apply coupon (if valid) ───────────────────────────────────────────────
  let baseUsd  = discountedPrice(pkg.priceUsd,  pkg.discountPct)
  let baseUsdt = discountedPrice(pkg.priceUsdt, pkg.discountPct)
  let appliedCoupon: string | null = null

  const coupon = couponRows[0]
  if (couponCode && coupon && coupon.active && (!coupon.maxUses || coupon.usedCount < coupon.maxUses)) {
    baseUsd   = +(baseUsd  * (1 - coupon.discountPct / 100)).toFixed(2)
    baseUsdt  = +(baseUsdt * (1 - coupon.discountPct / 100)).toFixed(2)
    appliedCoupon = couponCode
    await db
      .update(coupons)
      .set({ usedCount: sql`${coupons.usedCount} + 1` })
      .where(eq(coupons.id, coupon.id))
  }

  // ── Insert order ──────────────────────────────────────────────────────────
  const orderNumber = generateOrderNumber()
  const inserted = (
    await db
      .insert(orders)
      .values({
        orderNumber,
        packageId:     pkg.id,
        diamonds:      pkg.diamonds + pkg.bonusDiamonds,
        playerUid:     data.playerUid,
        nickname:      data.nickname || null,
        server:        data.server,
        email:         data.email || null,
        country:       data.country || null,
        phone:         data.phone || null,
        amountUsd:     baseUsd.toFixed(2),
        amountUsdt:    baseUsdt.toFixed(2),
        paymentMethod: data.paymentMethod,
        walletAddress: null,
        couponCode:    appliedCoupon,
        status:        'pending_payment',
      })
      .returning()
  )[0]

  return NextResponse.json({ order: inserted })
}
