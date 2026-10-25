import { NextResponse } from 'next/server'
import { getAtlosCredentials } from '@/lib/atlos'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { merchantId } = getAtlosCredentials()
  const settings = await getSettings()
  const activeMerchantId = merchantId || settings.atlosMerchantId || null
  return NextResponse.json({
    configured: Boolean(activeMerchantId),
    merchantId: activeMerchantId,
  })
}
