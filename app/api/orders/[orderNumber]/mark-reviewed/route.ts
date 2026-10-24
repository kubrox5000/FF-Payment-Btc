import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Payment status is confirmed automatically by Heleket.' }, { status: 410 })
}
