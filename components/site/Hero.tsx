'use client'

import Link from 'next/link'
import { Zap, ShieldCheck, Headphones, CheckCircle2, Gem, ArrowUpRight, ArrowDown } from 'lucide-react'
import { useLocale } from '@/components/geo/GeoLocaleProvider'
import { OfficialHeroBadge } from '@/components/site/OfficialBadge'

export function Hero() {
  const { t } = useLocale()
  const features = [
    { icon: Zap, label: t('feat_instant') },
    { icon: ShieldCheck, label: t('feat_secure') },
    { icon: Headphones, label: t('feat_support') },
    { icon: CheckCircle2, label: t('feat_customers') },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-card/30">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
        <div className="min-w-0 text-start">
          <OfficialHeroBadge />
          <p className="hero-fade mb-5 flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="h-px w-7 bg-primary/60" aria-hidden="true" />
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />{t('feat_instant')}
          </p>
          <h1 className="hero-fade hero-fade-2 max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl xl:text-6xl">
            {t('hero_title1')} <span className="text-primary">{t('hero_title2')}</span>
          </h1>
          <p className="hero-fade hero-fade-3 mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('hero_tagline')}
          </p>
          <div className="hero-fade hero-fade-4 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/top-up" prefetch className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              {t('hero_topup')}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
            <Link href="/track" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {t('hero_track')}
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5">
            {features.slice(0, 2).map((f) => (
              <span key={f.label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <f.icon className="h-4 w-4 text-primary" aria-hidden="true" />{f.label}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-fade hero-fade-3 relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" translate="no">Free Fire</span>
              <Gem className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div className="relative grid h-52 place-items-center overflow-hidden sm:h-64" aria-hidden="true">
              <div className="absolute h-44 w-44 rotate-45 rounded-[2rem] border border-primary/15 bg-primary/5 sm:h-48 sm:w-48" />
              <div className="absolute h-32 w-32 rotate-45 rounded-3xl border border-primary/25" />
              <Gem className="relative h-24 w-24 text-primary sm:h-28 sm:w-28" strokeWidth={1} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {features.slice(2).map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3.5">
                  <f.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-xs font-medium leading-relaxed">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="#packages" className="mt-4 flex items-center justify-between rounded-xl px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {t('home_packages_title')}<ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
