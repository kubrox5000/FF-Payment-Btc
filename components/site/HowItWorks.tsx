'use client'

import { Target, IdCard, CreditCard, Gem } from 'lucide-react'
import { Reveal } from '@/components/site/Reveal'
import { useLocale } from '@/components/geo/GeoLocaleProvider'

export function HowItWorks() {
  const { t } = useLocale()

  const steps = [
    { icon: Target, iconClass: 'text-primary', num: '01', title: t('how1_t'), desc: t('how1_d') },
    { icon: IdCard, iconClass: 'text-primary', num: '02', title: t('how2_t'), desc: t('how2_d') },
    { icon: CreditCard, iconClass: 'text-primary', num: '03', title: t('how3_t'), desc: t('how3_d') },
    { icon: Gem, iconClass: 'text-primary', num: '04', title: t('how4_t'), desc: t('how4_d') },
  ]

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t('how_title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* connecting line (desktop) */}


        {steps.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.1} className="relative flex flex-col items-start rounded-2xl border border-border bg-card p-6 text-start">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/5">
              <s.icon className={`h-6 w-6 ${s.iconClass}`} />
            </span>
            <span className="mt-4 text-sm font-bold text-primary" translate="no">{s.num}</span>
            <h3 className="mt-1 text-base font-bold sm:text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}