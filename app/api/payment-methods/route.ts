import { NextResponse } from 'next/server'
import { HELEKET_METHOD } from '@/lib/payment-method'

export async function GET() {
  return NextResponse.json({ methods: [HELEKET_METHOD] })
}
