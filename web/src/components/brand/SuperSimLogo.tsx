import { cn } from '@/lib/utils'

interface SuperSimLogoProps {
  className?: string
  height?: number
}

export function SuperSimLogo({ className, height = 28 }: SuperSimLogoProps) {
  return (
    <img
      src="/assets/supersim-logo.svg"
      alt="SuperSim"
      className={cn('w-auto', className)}
      style={{ height }}
    />
  )
}
