import { heleketConfigured } from '@/lib/heleket'

export const dynamic = 'force-dynamic'

export default function AdminPaymentMethodsPage() {
  const configured = heleketConfigured()
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Heleket</h1><p className="mt-2 text-sm text-muted-foreground">بوابة الدفع الوحيدة في المتجر · The store’s only payment gateway</p></div>
      <div className="glass space-y-4 rounded-2xl border border-border p-6">
        <p className={configured ? 'text-emerald-400' : 'text-amber-400'}>{configured ? 'بيانات الربط موجودة — يلزم اختبار الدفع للتحقق من التفعيل. / Credentials configured; verify with a payment test.' : 'بانتظار إعداد بيانات التاجر في Netlify. / Merchant credentials need configuration in Netlify.'}</p>
        <p className="text-sm leading-7 text-muted-foreground">أضف HELEKET_MERCHANT_ID و HELEKET_API_KEY كمتغيرات سرية للخادم في إعدادات Netlify ثم أعد النشر. استخدم مفتاح الدفع لمتجر معتمد في Heleket. لا تدخل المفاتيح في محرر ملفات الموقع.</p>
        <p className="text-sm leading-7 text-muted-foreground">الطلبات تُؤكّد تلقائيًا بعد التحقق من الفاتورة. إدارة تجهيز الطلبات تبقى من صفحة الطلبات.</p>
        <p className="text-sm text-muted-foreground">Webhook: <code dir="ltr">/api/payments/heleket/webhook</code></p>
        <a href="https://doc.heleket.com/" target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold text-primary">Heleket documentation ↗</a>
      </div>
    </div>
  )
}
