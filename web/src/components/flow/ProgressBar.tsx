import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  height?: 'sm' | 'md'
  animated?: boolean
  className?: string
}

export function ProgressBar({
  value,
  height = 'md',
  animated = false,
  className,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden bg-line',
        height === 'sm' ? 'h-1' : 'h-1.5',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-r-md bg-gradient-to-r from-orange-deep to-orange',
          animated && 'animate-fill-in',
        )}
        style={animated ? undefined : { width: `${value}%`, transition: 'width 0.5s ease' }}
      />
    </div>
  )
}
