import { useState } from 'react'
import { Menu, User } from 'lucide-react'
import { MockSideDrawer } from './MockSideDrawer'
import { SuperSimLogo } from './SuperSimLogo'
import { displayName, maskCpf } from '@/lib/cpf'
import { cn } from '@/lib/utils'

interface OfertasHeaderProps {
  nome: string
  cpf: string
  className?: string
}

const MENU_LINKS = ['Meu cadastro', 'Condições do empréstimo', 'Central de ajuda', 'Política de privacidade']

export function OfertasHeader({ nome, cpf, className }: OfertasHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-border bg-white shadow-[0_1px_0_var(--color-border)]',
          className,
        )}
      >
        <div className="mx-auto flex max-w-[420px] items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-[#F3F4F6] text-text-mid"
            >
              <Menu className="size-[18px]" strokeWidth={2.5} />
            </button>
            <SuperSimLogo height={34} />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col items-end gap-0.5">
              <span className="max-w-[120px] truncate text-[13px] font-semibold text-text">
                {displayName(nome)}
              </span>
              <span className="text-[11px] tracking-wide text-text-light">{maskCpf(cpf)}</span>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary-light text-primary-dark">
              <User className="size-5" strokeWidth={2} />
            </div>
          </div>
        </div>
      </header>

      <MockSideDrawer open={menuOpen} title="Menu" onClose={() => setMenuOpen(false)}>
        <ul className="space-y-2">
          {MENU_LINKS.map((link) => (
            <li key={link}>
              <button
                type="button"
                className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-text-mid hover:bg-primary-subtle"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      </MockSideDrawer>
    </>
  )
}
