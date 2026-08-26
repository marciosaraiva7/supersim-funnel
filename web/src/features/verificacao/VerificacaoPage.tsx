import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Check,
  Shield,
  X,
  Zap,
} from 'lucide-react'
import { AppHeader } from '@/components/brand/AppHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { ProgressBar } from '@/components/flow/ProgressBar'
import { Stepper } from '@/components/flow/Stepper'
import { SocialProofToast } from '@/components/flow/SocialProofToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MOCK_CPF_RESPONSE, MOTHER_OPTIONS } from '@/mocks/flow-data'
import { useFlow } from '@/context/FlowContext'
import { isValidCpf } from '@/lib/cpf'
import { buildUrlWithUtms } from '@/lib/utm'
import { cn, formatCpf } from '@/lib/utils'

export function VerificacaoPage() {
  const {
    verificationStep,
    setVerificationStep,
    cpf,
    setCpf,
    setNome,
    nome,
    setMotherName,
    birthDate,
    setBirthDate,
    resetVerification,
    startOfertas,
  } = useFlow()

  const [cpfInput, setCpfInput] = useState(cpf)
  const [loading, setLoading] = useState(false)
  const [cpfError, setCpfError] = useState(false)
  const [selectedMother, setSelectedMother] = useState<string | null>(null)

  const progress = verificationStep * 25

  useEffect(() => {
    setCpfInput(cpf)
  }, [cpf])

  const navigate = useNavigate()

  useEffect(() => {
    if (verificationStep !== 4) return
    const timer = setTimeout(() => {
      startOfertas()
      navigate(buildUrlWithUtms('/ofertas'))
    }, 3000)
    return () => clearTimeout(timer)
  }, [verificationStep, navigate, startOfertas])

  async function handleCpfSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = cpfInput.replace(/\D/g, '')
    if (digits.length !== 11 || !isValidCpf(cpfInput)) {
      setCpfError(true)
      return
    }
    setCpfError(false)
    setLoading(true)
    setCpf(cpfInput)
    await new Promise((r) => setTimeout(r, 1000))
    setNome(MOCK_CPF_RESPONSE.nome)
    setBirthDate(MOCK_CPF_RESPONSE.dataNasc)
    setLoading(false)
    setVerificationStep(2)
  }

  function handleMotherSelect(name: string) {
    setSelectedMother(name)
    setMotherName(name)
    setTimeout(() => setVerificationStep(3), 400)
  }

  function handleBirthConfirm(correct: boolean) {
    if (correct) {
      setVerificationStep(4)
    } else {
      resetVerification()
      setCpfInput('')
      setSelectedMother(null)
    }
  }

  return (
    <div className="min-h-dvh bg-bg-app pt-[72px] text-text">
      <AppHeader />

      <div className="mx-auto max-w-[420px] px-5 pb-8">
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <Stepper currentStep={verificationStep} />
          <div className="my-4 h-px bg-border" />
          <ProgressBar value={progress} height="sm" />

          <AnimatePresence mode="wait">
            {verificationStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="pt-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white">
                    <Zap className="size-5" />
                  </div>
                  <h1 className="text-xl font-bold">Vamos começar!</h1>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-text-light">
                  Informe seu CPF para verificarmos seus dados e liberar as melhores
                  ofertas de crédito disponíveis para você.
                </p>
                <form onSubmit={handleCpfSubmit}>
                  <label
                    htmlFor="cpf-input"
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-text-mid"
                  >
                    Seu CPF
                  </label>
                  <Input
                    id="cpf-input"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={cpfInput}
                    onChange={(e) => {
                      setCpfInput(formatCpf(e.target.value))
                      setCpfError(false)
                    }}
                    required
                    autoComplete="off"
                    className={cn('mb-1', cpfError && 'border-red-400')}
                  />
                  {cpfError && (
                    <p className="mb-3 text-xs text-red-500">CPF inválido. Verifique os números digitados.</p>
                  )}
                  {!cpfError && <div className="mb-4" />}
                  <Button
                    type="submit"
                    disabled={loading || cpfInput.replace(/\D/g, '').length !== 11}
                    className="w-full"
                  >
                    {loading ? (
                      <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      'Verificar meu CPF'
                    )}
                  </Button>
                </form>
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#FEF9C3] px-3 py-3 text-xs leading-relaxed text-[#92400E]">
                  <Shield className="mt-0.5 size-4 shrink-0" />
                  Seus dados estão protegidos com criptografia de ponta a ponta.
                </div>
              </motion.div>
            )}

            {verificationStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="pt-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white">
                    <Shield className="size-5" />
                  </div>
                  <h1 className="text-xl font-bold">Verificação de segurança</h1>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-text-light">
                  Para sua proteção, selecione abaixo o nome correto da sua mãe.
                </p>
                <div className="flex flex-col gap-3" role="radiogroup" aria-label="Nome da mãe">
                  {MOTHER_OPTIONS.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="radio"
                      aria-checked={selectedMother === name}
                      onClick={() => handleMotherSelect(name)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left text-sm font-bold uppercase transition-all active:scale-[0.98]',
                        selectedMother === name
                          ? 'border-primary bg-primary-subtle'
                          : 'border-border bg-white hover:border-primary/50',
                      )}
                    >
                      <span
                        className={cn(
                          'size-5 shrink-0 rounded-full border-2',
                          selectedMother === name
                            ? 'border-primary bg-primary'
                            : 'border-border',
                        )}
                      />
                      {name}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-3 text-xs leading-relaxed text-primary-dark">
                  <Shield className="mt-0.5 size-4 shrink-0" />
                  Etapa obrigatória para garantir a segurança da sua conta.
                </div>
              </motion.div>
            )}

            {verificationStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="pt-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white">
                    <Calendar className="size-5" />
                  </div>
                  <h1 className="text-xl font-bold">Confirme seu nascimento</h1>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-text-light">
                  Última etapa! Verifique se a data de nascimento abaixo está correta.
                </p>
                <div className="mb-5 flex items-center gap-3 rounded-xl border-2 border-border bg-white px-4 py-5">
                  <Calendar className="size-5 text-text-light" />
                  <span className="flex-1 text-center text-lg font-bold">
                    {birthDate}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={() => handleBirthConfirm(true)}
                    className="w-full gap-2"
                  >
                    <Check className="size-5" />
                    Sim, está correto
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleBirthConfirm(false)}
                    className="w-full gap-2"
                  >
                    <X className="size-5" />
                    Não, está incorreto
                  </Button>
                </div>
              </motion.div>
            )}

            {verificationStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-subtle text-primary">
                  <Check className="size-8" strokeWidth={2.5} />
                </div>
                <h1 className="mb-2 text-xl font-bold">Verificação concluída!</h1>
                {nome && (
                  <p className="mb-4 max-w-[280px] text-sm leading-relaxed text-text-light">
                    Tudo certo, {nome}! Sua identidade foi confirmada com sucesso.
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2 text-sm text-text-light">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  Preparando suas ofertas de crédito...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TrustFooter />
      <SocialProofToast />
    </div>
  )
}
