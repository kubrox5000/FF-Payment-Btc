import type { PublicPaymentMethod } from './types'

export const HELEKET_METHOD: PublicPaymentMethod = {
  id: 0, key: 'HELEKET', label: 'Heleket', network: 'Crypto checkout',
  cat: 'crypto', icon: 'heleket', walletAddress: '', active: true, sortOrder: 0,
}
