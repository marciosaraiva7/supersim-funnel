import { cn } from '@/lib/utils'

interface GoalOptionCardProps {
  emoji: string
  label: string
  selected: boolean
  onSelect: () => void
  delay?: number
}

export function GoalOptionCard({
  emoji,
  label,
  selected,
  onSelect,
  delay = 0,
}: GoalOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        'animate-fade-up flex w-full items-center justify-between rounded-2xl border-2 px-5 py-[18px] text-left text-[16.5px] font-semibold transition-all active:scale-[0.98]',
        selected
          ? 'border-orange-deep bg-orange text-white shadow-[0_10px_24px_-10px_rgba(240,99,10,0.55)] -translate-y-px'
          : 'border-line bg-white text-ink',
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className="text-[19px]">{emoji}</span>
        {label}
      </span>
      <span
        className={cn(
          'relative size-[22px] shrink-0 rounded-full border-2 transition-all',
          selected
            ? 'border-white bg-white/15'
            : 'border-[#D8D2CA] bg-white',
        )}
      >
        {selected && (
          <span className="absolute inset-1 rounded-full bg-white" />
        )}
      </span>
    </button>
  )
}
