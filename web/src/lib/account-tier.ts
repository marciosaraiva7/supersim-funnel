import type { CartaoData } from '@/context/FlowContext'

export type AccountTier = 'bronze' | 'prata' | 'ouro'

export interface AccountTierInfo {
  id: AccountTier
  label: string
  badgeClass: string
  cardClass: string
  iconClass: string
}

const TIERS: Record<AccountTier, AccountTierInfo> = {
  bronze: {
    id: 'bronze',
    label: 'Bronze',
    badgeClass: 'bg-[#CD7F32]/20 text-[#F5D0A8] ring-[#CD7F32]/40',
    cardClass: 'bg-gradient-to-br from-[#3D2914] via-[#1F2937] to-[#111827]',
    iconClass: 'text-[#CD7F32]',
  },
  prata: {
    id: 'prata',
    label: 'Prata',
    badgeClass: 'bg-white/15 text-white ring-white/30',
    cardClass: 'bg-gradient-to-br from-[#4B5563] via-[#374151] to-[#1F2937]',
    iconClass: 'text-[#E5E7EB]',
  },
  ouro: {
    id: 'ouro',
    label: 'Ouro',
    badgeClass: 'bg-[#FFD700]/20 text-[#FFE566] ring-[#FFD700]/45',
    cardClass: 'bg-gradient-to-br from-[#5C4A1F] via-[#1F2937] to-[#111827]',
    iconClass: 'text-[#FFD700]',
  },
}

export function getAccountTier(cartaoData: CartaoData, saqueComplete: boolean): AccountTierInfo {
  if (cartaoData.tacPaid || saqueComplete) return TIERS.ouro
  if (cartaoData.depositPaid || cartaoData.dataComplete) return TIERS.prata
  return TIERS.bronze
}
