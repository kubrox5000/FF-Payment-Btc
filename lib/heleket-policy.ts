import type { PublicPaymentMethod } from './types'

/** A disabled gateway must stay hidden even if an active database row exists. */
export function applyHeleketAvailability(methods: PublicPaymentMethod[], enabled: boolean): PublicPaymentMethod[] {
  if (!enabled) return methods.filter((method) => method.key !== 'HELEKET')
  if (methods.some((method) => method.key === 'HELEKET')) return methods
  return [
    {
      id: 0,
      key: 'HELEKET',
      label: 'Heleket',
      network: 'USDT · BTC · ETH · TRX…',
      cat: 'crypto',
      icon: 'heleket',
      walletAddress: '',
      active: true,
      sortOrder: -1,
    },
    ...methods,
  ]
}
