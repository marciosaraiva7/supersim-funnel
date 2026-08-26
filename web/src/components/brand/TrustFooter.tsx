import { Lock, Shield, Building2 } from 'lucide-react'
import { SuperSimLogo } from './SuperSimLogo'
import { FOOTER } from '@/mocks/flow-data'
import { cn } from '@/lib/utils'

interface TrustFooterProps {
  variant?: 'compact' | 'full'
  className?: string
}

export function TrustFooter({ variant = 'full', className }: TrustFooterProps) {
  if (variant === 'compact') {
    return (
      <footer className={cn('pb-[22px] text-center text-[11px] text-muted', className)}>
        © 2026 · Página segura de simulação
      </footer>
    )
  }

  return (
    <footer className={cn('bg-bg-app px-5 py-8', className)}>
      <div className="mx-auto flex max-w-[420px] flex-col items-center gap-3 text-center">
        <SuperSimLogo height={28} />
        <small className="text-xs leading-relaxed text-text-light">
          <strong className="text-primary">{FOOTER.company}</strong>
          <br />
          {FOOTER.cnpj}
        </small>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-text-light">
          <span className="flex items-center gap-1">
            <Lock className="size-3.5" />
            SSL Seguro
          </span>
          <span className="flex items-center gap-1">
            <Shield className="size-3.5" />
            Dados protegidos
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="size-3.5" />
            Instituição regulada
          </span>
        </div>
      </div>
    </footer>
  )
}
