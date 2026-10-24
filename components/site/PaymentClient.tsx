'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useLocale } from '@/components/geo/GeoLocaleProvider'
import type { PublicOrder } from '@/lib/types'

export function PaymentClient({ order }: { order: PublicOrder }) {
  const { lang, formatPrice } = useLocale()
  const ar = lang === 'ar'
  const [status, setStatus] = useState(order.status)
  const [opening, setOpening] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [verificationPending, setVerificationPending] = useState(false)
  const paid = ['paid', 'processing', 'completed'].includes(status)
  const eligible = order.paymentMethod === 'HELEKET' && status === 'pending_payment'

  async function refresh() {
    setChecking(true)
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.orderNumber)}`, { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error()
      setStatus(data.order.status)
      setVerificationPending(Boolean(data.verificationPending))
    } catch { setVerificationPending(true) }
    finally { setChecking(false) }
  }

  useEffect(() => {
    if (paid || order.paymentMethod !== 'HELEKET' || status === 'cancelled') return
    let active = true
    let timer: ReturnType<typeof setTimeout>
    async function poll() {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(order.orderNumber)}`, { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error()
        if (active) {
          setStatus(data.order.status)
          setVerificationPending(Boolean(data.verificationPending))
        }
      } catch { if (active) setVerificationPending(true) }
      if (active) timer = setTimeout(poll, 20000)
    }
    void poll()
    return () => { active = false; clearTimeout(timer) }
  }, [order.orderNumber, order.paymentMethod, paid, status])

  async function checkout() {
    setOpening(true)
    setError('')
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.orderNumber)}/checkout`, { method: 'POST' })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error()
      window.location.assign(data.url)
    } catch {
      setError(ar ? 'تعذّر فتح بوابة الدفع. حاول مجددًا لنفس الطلب بعد قليل.' : 'Unable to open checkout. Retry this order shortly.')
      setOpening(false)
    }
  }

  return (
    <div className="glass mx-auto max-w-2xl rounded-2xl border border-border p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-600 text-2xl font-black text-white">H</span>
        <div><h2 className="text-xl font-bold">Heleket</h2><p className="text-sm text-muted-foreground">{ar ? 'دفع آمن بالعملات الرقمية' : 'Secure crypto checkout'}</p></div>
      </div>
      <dl className="my-6 space-y-3 rounded-xl bg-secondary/40 p-4 text-sm">
        <div className="flex justify-between gap-3"><dt>{ar ? 'رقم الطلب' : 'Order'}</dt><dd className="font-mono" translate="no">{order.orderNumber}</dd></div>
        <div className="flex justify-between gap-3"><dt>{ar ? 'الإجمالي' : 'Total'}</dt><dd className="font-bold">{formatPrice(Number(order.amountUsd))} <span className="text-xs text-muted-foreground">(USD {order.amountUsd})</span></dd></div>
        <div className="flex justify-between gap-3"><dt>{ar ? 'الماسات' : 'Diamonds'}</dt><dd>{order.diamonds} 💎</dd></div>
      </dl>
      {paid ? (
        <div role="status" className="flex gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-400"><CheckCircle2 className="h-6 w-6 shrink-0" /><p>{ar ? 'تم تأكيد الدفع. يمكنك متابعة تجهيز طلبك.' : 'Payment confirmed. You can now track fulfillment.'}</p></div>
      ) : eligible ? (
        <>
          <p className="mb-5 text-sm leading-6 text-muted-foreground">{ar ? 'انتقل إلى Heleket لاختيار العملة والشبكة وإتمام الدفع. يتم تحديث طلبك تلقائيًا بعد التأكيد، ولا تحتاج إلى رفع إثبات.' : 'Continue to Heleket to choose your currency and network. Your order updates automatically after confirmation; no payment proof is needed.'}</p>
          <button onClick={checkout} disabled={opening} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-60">
            {opening ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {ar ? 'الدفع عبر Heleket' : 'Pay with Heleket'}<ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : <p role="status" className="text-sm text-muted-foreground">{ar ? 'هذا الطلب غير متاح للدفع. تواصل مع الدعم بشأن الطلبات القديمة أو الملغاة.' : 'This order is not available for payment. Contact support about legacy or cancelled orders.'}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
      {verificationPending && <p role="status" className="mt-4 text-sm text-amber-400">{ar ? 'ننتظر تأكيد بوابة الدفع. إذا دفعت بالفعل، لا تدفع مجددًا.' : 'Waiting for payment verification. If you already paid, please do not pay again.'}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <button onClick={refresh} disabled={checking} className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50">{checking && <Loader2 className="h-4 w-4 animate-spin" />}{ar ? 'تحديث حالة الدفع' : 'Refresh payment status'}</button>
        <Link href={`/track?order=${encodeURIComponent(order.orderNumber)}`} className="font-semibold text-primary">{ar ? 'تتبع الطلب' : 'Track order'}</Link>
      </div>
    </div>
  )
}
