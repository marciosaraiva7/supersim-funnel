import { useState } from 'react'
import { Bell, Menu, User } from 'lucide-react'
import { MockSideDrawer } from './MockSideDrawer'
import { SuperSimLogo } from './SuperSimLogo'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  className?: string
}

const MENU_LINKS = ['Início', 'Simular empréstimo', 'Como funciona', 'Central de ajuda']

export function AppHeader({ className }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-border bg-white shadow-[0_1px_0_var(--color-border)]',
          className,
        )}
      >
        <div className="mx-auto flex max-w-[420px] items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex flex-1 items-center gap-3.5">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-[#F3F4F6] text-text-mid"
            >
              <Menu className="size-[18px]" strokeWidth={2.5} />
            </button>
            <SuperSimLogo height={26} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notificações"
              onClick={() => setNotifOpen(true)}
              className="relative flex size-10 items-center justify-center rounded-full bg-[#F3F4F6] text-text-mid"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
            </button>
            <button
              type="button"
              aria-label="Perfil"
              className="flex size-10 items-center justify-center rounded-full border-2 border-primary/30 text-primary"
            >
              <User className="size-[18px]" />
            </button>
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

      <MockSideDrawer
        open={notifOpen}
        title="Notificações"
        onClose={() => setNotifOpen(false)}
        side="right"
      >
        <div className="space-y-3 text-sm">
          <p className="rounded-xl border border-border bg-[#F9FAFB] p-3">
            <strong>Simulação disponível</strong>
            <br />
            <span className="text-text-light">Confira as condições do seu empréstimo.</span>
          </p>
          <p className="rounded-xl border border-border bg-[#F9FAFB] p-3">
            <strong>Consulta gratuita</strong>
            <br />
            <span className="text-text-light">Seus dados estão protegidos.</span>
          </p>
        </div>
      </MockSideDrawer>
    </>
  )
}
