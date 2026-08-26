import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative w-full overflow-hidden bg-line', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-r-md bg-gradient-to-r from-orange-deep to-orange transition-all duration-500 ease-out"
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
