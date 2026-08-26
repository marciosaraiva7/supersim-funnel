import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-14 w-full rounded-[14px] border-2 border-border bg-white px-4 text-lg font-semibold text-text outline-none transition-colors placeholder:text-text-light focus:border-primary',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
