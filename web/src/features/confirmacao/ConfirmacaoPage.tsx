import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Mail, Smartphone } from 'lucide-react'
import { OfertasHeader } from '@/components/brand/OfertasHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { Input } from '@/components/ui/input'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { formatPhone, isValidEmail, isValidPhone } from '@/lib/phone'
import { buildUrlWithUtms } from '@/lib/utm'
import { cn } from '@/lib/utils'

const BENEFITS = [
  'Boletos de pagamento por e-mail',
  'Avisos de vencimento por SMS',
  'Atualizações sobre seu contrato',
  'Comprovantes de pagamento',
]

export function ConfirmacaoPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { nome, cpf, dueDate, email, phone, setContact, completeContact } = useFlow()
  const [emailInput, setEmailInput] = useState(email)
  const [phoneInput, setPhoneInput] = useState(phone ? formatPhone(phone) : '')
  const [emailError, setEmailError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cpf || !dueDate) navigate('/vencimento')
  }, [cpf, dueDate, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const emailValid = isValidEmail(emailInput.trim())
    const phoneValid = isValidPhone(phoneInput)
    setEmailError(!emailValid)
    setPhoneError(!phoneValid)
    if (!emailValid || !phoneValid) return

    const phoneClean = phoneInput.replace(/\D/g, '')
    setContact(emailInput.trim(), phoneClean)
    setLoading(true)
    setTimeout(() => {
      completeContact()
      navigate(buildUrlWithUtms('/criando'))
    }, 1500)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app pt-[72px] text-text">
      <OfertasHeader nome={nome} cpf={cpf} />

      <div className="mx-auto w-full max-w-[420px] flex-1 px-5 pb-8">
        <h1 className="mb-2 text-2xl font-bold leading-tight">
          Confirme seus <span className="text-primary-dark">Dados de Contato</span>
        </h1>
        <p className="mb-6 text-sm text-text-light">
          Para receber os boletos e atualizações sobre seu empréstimo
        </p>

        <div className="mb-6 flex gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-dark">
            <Bell className="size-5" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold">Você receberá:</h3>
            <ul className="space-y-1.5">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-mid">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-mid">
              <Mail className="size-4" />
              E-mail <span className="text-primary">*</span>
            </label>
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value)
                setEmailError(false)
              }}
              placeholder="seu@email.com"
              className={cn(emailError && 'border-red-400')}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500">Por favor, insira um e-mail válido</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-mid">
              <Smartphone className="size-4" />
              Telefone/Celular <span className="text-primary">*</span>
            </label>
            <Input
              type="tel"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(formatPhone(e.target.value))
                setPhoneError(false)
              }}
              placeholder="(11) 98765-4321"
              maxLength={15}
              className={cn(phoneError && 'border-red-400')}
            />
            {phoneError && (
              <p className="mt-1 text-xs text-red-500">Por favor, insira um telefone válido</p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dark px-4 py-4 text-base font-semibold text-white shadow-[0_4px_15px_rgba(251,150,55,0.3)]"
          >
            <Check className="size-5" />
            Confirmar e Continuar
          </button>
        </form>
      </div>

      <TrustFooter />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-semibold text-text">Salvando seus dados...</p>
          </div>
        </div>
      )}
    </div>
  )
}
