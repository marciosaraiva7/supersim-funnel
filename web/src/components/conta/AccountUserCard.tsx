import { Crown, Medal, Sparkles } from 'lucide-react'
import type { AccountTier, AccountTierInfo } from '@/lib/account-tier'
import { cn } from '@/lib/utils'
import { AccountTierBadge } from './AccountTierBadge'

const TIER_ICONS: Record<AccountTier, typeof Medal> = {
  bronze: Medal,
  prata: Sparkles,
  ouro: Crown,
}

interface AccountUserCardProps {
  name: string
  tier: AccountTierInfo
  className?: string
}

export function AccountUserCard({ name, tier, className }: AccountUserCardProps) {
  const Icon = TIER_ICONS[tier.id]

  return (
    <div
      className={cn(
        'relative mb-4 overflow-hidden rounded-2xl p-5 text-white',
        tier.cardClass,
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-3 -top-3 size-28 opacity-[0.12]',
          tier.iconClass,
        )}
        strokeWidth={1.25}
      />
      <Icon
        aria-hidden
        className={cn(
          'pointer-events-none absolute -bottom-6 right-16 size-20 opacity-[0.06]',
          tier.iconClass,
        )}
        strokeWidth={1.25}
      />

      <div className="relative">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-sm text-white/70">Olá,</p>
          <AccountTierBadge tier={tier} />
        </div>
        <p className="text-xl font-bold" id="heroNm">
          {name}
        </p>
        <p className="mt-1 text-xs text-white/50">Conta {tier.label}</p>
      </div>
    </div>
  )
}
