'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { memo, useMemo } from 'react'
import { ShieldCheck, Rocket, HeartHandshake, BadgePercent, Flame, ArrowUpRight, Gem } from 'lucide-react'
import { Hero } from '@/components/site/Hero'
import { PackageCard } from '@/components/site/PackageCard'
import { OfficialBannerSection } from '@/components/site/OfficialBadge'
import { useLocale } from '@/components/geo/GeoLocaleProvider'
import type { PublicPackage, PublicReview } from '@/lib/types'

// Below-fold sections are code-split (separate chunks) but still server-rendered
// so their content appears immediately in the first HTML — no blank wait.
const HowItWorks        = dynamic(() => import('@/components/site/HowItWorks').then(m => ({ default: m.HowItWorks })))
const TrustpilotReviews = dynamic(() => import('@/components/site/TrustpilotReviews').then(m => ({ default: m.TrustpilotReviews })))
const TrustpilotFooter  = dynamic(() => import('@/components/site/TrustpilotReviews').then(m => ({ default: m.TrustpilotFooter })))
const CustomerTestimonials = dynamic(() => import('@/components/site/CustomerTestimonials').then(m => ({ default: m.CustomerTestimonials })))
const FaqSection        = dynamic(() => import('@/components/site/FaqSection').then(m => ({ default: m.FaqSection })))

interface Props {
  pkgs: PublicPackage[]
  reviews: PublicReview[]
  totalReviews: number
  averageRating: number
  freeGift?: string
}

// Memoised package link so locale re-renders don't cascade to every card
const PkgLink = memo(function PkgLink({ p, freeGift }: { p: PublicPackage; freeGift?: string }) {
  return (
    <Link href={`/top-up?package=${p.id}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" prefetch>
      <PackageCard pkg={p} freeGift={freeGift} />
    </Link>
  )
})
PkgLink.displayName = 'PkgLink'

export function HomeContent({ pkgs, reviews, totalReviews, averageRating, freeGift }: Props) {
  const { t } = useLocale()
  const popular = useMemo(() => pkgs.filter((p) => p.popular || p.flashSale), [pkgs])

  const whyUs = useMemo(() => [
    { icon: Rocket,        iconClass: 'text-primary',   num: '01', title: t('why1_t'), desc: t('why1_d') },
    { icon: ShieldCheck,   iconClass: 'text-primary', num: '02', title: t('why2_t'), desc: t('why2_d') },
    { icon: BadgePercent,  iconClass: 'text-primary',    num: '03', title: t('why3_t'), desc: t('why3_d') },
    { icon: HeartHandshake,iconClass: 'text-primary',    num: '04', title: t('why4_t'), desc: t('why4_d') },
  ], [t])

  return (
    <main>
      <Hero />

      {/* Official Authorized Reseller Banner */}
      <OfficialBannerSection />

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{t('home_packages_kicker')}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('home_packages_title')}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t('home_packages_sub')}</p>
        </div>

        {pkgs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Gem className="mx-auto mb-4 h-8 w-8 text-primary" aria-hidden="true" />
            {t('no_pkgs')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {pkgs.map((p) => (
              <PkgLink key={p.id} p={p} freeGift={freeGift} />
            ))}
          </div>
        )}
      </section>

      {/* Popular / Best sellers */}
      {popular.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-8 flex items-center gap-4 border-b border-border pb-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/5 text-primary"><Flame className="h-6 w-6" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t('home_popular_kicker')}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t('home_popular_title')}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {popular.map((p) => (
              <PkgLink key={p.id} p={p} freeGift={freeGift} />
            ))}
          </div>
        </section>
      )}

      {/* How does it work — lazy */}
      <HowItWorks />

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t('why_kicker')}</h2>
        </div>
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w) => (
            <div key={w.num} className="relative flex flex-col items-start rounded-2xl border border-border bg-card p-6 text-start">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/5">
                <w.icon className={`h-6 w-6 ${w.iconClass}`} />
              </span>
              <span className="mt-4 text-sm font-bold text-primary" translate="no">{w.num}</span>
              <h3 className="mt-1 text-base font-bold sm:text-lg">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews — lazy */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <TrustpilotReviews reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
        <TrustpilotFooter />
      </section>

      {/* Customer testimonials — lazy */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <CustomerTestimonials reviews={reviews} />
      </section>

      {/* FAQ — lazy */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{t('home_faq_kicker')}</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{t('home_faq_title')}</h2>
        </div>
        <FaqSection />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-4xl">{t('home_cta_title')}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">{t('home_cta_sub')}</p>
          <Link
            href="/top-up"
            prefetch
            className="mt-6 inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('home_cta_btn')}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
