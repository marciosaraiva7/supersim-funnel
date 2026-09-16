import type { AccountTierInfo } from '@/lib/account-tier'
import { cn } from '@/lib/utils'

export function AccountTierBadge({ tier, className }: { tier: AccountTierInfo; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset',
        tier.badgeClass,
        className,
      )}
    >
      {tier.label}
    </span>
  )
}
