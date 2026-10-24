import { PaymentMethodsClient } from '@/components/admin/PaymentMethodsClient'
import { isHeleketConfigured } from '@/lib/heleket'

export const dynamic = 'force-dynamic'

export default function AdminPaymentMethodsPage() {
  return <PaymentMethodsClient heleket={{
    configured: isHeleketConfigured(),
    merchantPresent: Boolean(process.env.HELEKET_MERCHANT_ID),
    keyPresent: Boolean(process.env.HELEKET_API_KEY),
  }} />
}
