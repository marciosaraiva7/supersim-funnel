import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-orange to-orange-deep text-white shadow-[0_14px_28px_-12px_rgba(240,99,10,0.6)] active:scale-[0.98]',
        disabled: 'bg-line text-muted cursor-not-allowed',
        danger: 'bg-danger text-white active:scale-[0.98]',
        outline:
          'border-2 border-border bg-white text-text hover:border-primary hover:bg-primary-subtle',
        ghost: 'bg-transparent text-text-mid',
      },
      size: {
        default: 'h-[54px] rounded-2xl px-6 text-[17px]',
        sm: 'h-10 rounded-xl px-4 text-sm',
        lg: 'h-14 rounded-2xl px-8 text-lg',
        pill: 'h-10 rounded-full px-[22px] text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
