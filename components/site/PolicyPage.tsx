'use client'

import { ShieldCheck, FileText, RotateCcw, Truck } from 'lucide-react'
import { useLocale } from '@/components/geo/GeoLocaleProvider'
import { POLICY_CONTENT, type PolicyKey } from '@/lib/policies'

const ICONS: Record<PolicyKey, React.ReactNode> = {
  privacy: <ShieldCheck className="h-6 w-6" />,
  terms: <FileText className="h-6 w-6" />,
  refund: <RotateCcw className="h-6 w-6" />,
  delivery: <Truck className="h-6 w-6" />,
}


export function PolicyPage({ policy }: { policy: PolicyKey }) {
  const { lang, translateText } = useLocale()
  const c = POLICY_CONTENT[policy][lang] ?? POLICY_CONTENT[policy].en
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/25 ring-1 ring-inset ring-white/10 text-gold">
          {ICONS[policy]}
        </span>
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{translateText(c.title)}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{translateText(c.updated)}</p>
        </div>
      </div>

      <p className="mb-8 rounded-2xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
        {translateText(c.intro)}
      </p>

      <div className="space-y-6">
        {c.sections.map((s, i) => (
          <section key={i}>
            <h2 className="mb-1.5 flex items-baseline gap-2 text-lg font-bold">
              <span className="text-gold" translate="no">{String(i + 1).padStart(2, '0')}</span>
              {translateText(s.h)}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{translateText(s.b)}</p>
          </section>
        ))}
      </div>
    </div>
  )
}