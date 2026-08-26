import { NextResponse } from 'next/server'
import { db } from '@/db'
import { packages } from '@/db/schemas'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  const rows = await db
    .select()
    .from(packages)
    .where(eq(packages.active, true))
    .orderBy(asc(packages.sortOrder))
  return NextResponse.json({ packages: rows })
}
