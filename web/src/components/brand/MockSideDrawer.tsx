import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MockSideDrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  side?: 'left' | 'right'
}

export function MockSideDrawer({
  open,
  title,
  onClose,
  children,
  side = 'left',
}: MockSideDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className={cn(
          'absolute top-0 h-full w-full max-w-[320px] bg-white shadow-xl',
          side === 'left' ? 'left-0' : 'right-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar menu">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </aside>
    </div>
  )
}
