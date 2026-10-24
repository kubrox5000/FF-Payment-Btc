import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Manual payment submissions are disabled. Please pay through Heleket.' }, { status: 410 })
}
