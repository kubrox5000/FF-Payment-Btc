import { redirect } from 'next/navigation'

export default async function PaymentReturn({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  if (order && /^[A-Za-z0-9_-]{1,128}$/.test(order)) redirect(`/payment/${encodeURIComponent(order)}`)
  redirect('/track')
}
