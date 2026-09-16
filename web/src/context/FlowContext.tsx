import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  generateCardCvv,
  generateCardExpiry,
  generateCardNumber,
  MIN_DEPOSIT,
  TAC_MOCK_RELEASE_MS_MAX,
  TAC_MOCK_RELEASE_MS_MIN,
} from '@/mocks/cartao-data'

export type Objective = 'pessoal' | 'negocio' | null

export interface OfertasData {
  loanPurpose: string
  occupation: string
  monthlyIncome: string
  paymentDay: string
  education: string
  cpfSituation: string
}

export interface AnaliseData {
  answers: string[]
  pixType: string
  pixKey: string
  bankName: string
  selectedInstallments: number
  selectedMonthlyPayment: number
  analiseComplete: boolean
}

export interface CartaoData {
  depositAmount: number
  depositPaid: boolean
  depositPaidAt: string | null
  depositReleased: boolean
  holderName: string
  zip: string
  address: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  dataComplete: boolean
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  tacPaid: boolean
  tacPaidAt: string | null
  tacSubmittedAt: string | null
  tacExpectedReleaseAt: string | null
  applePayAdded: boolean
  googlePayAdded: boolean
}

export interface FlowState {
  objective: Objective
  cpf: string
  nome: string
  motherName: string
  birthDate: string
  loanAmount: number
  verificationStep: 1 | 2 | 3 | 4
  ofertasStep: 1 | 2 | 3 | 4 | 5
  ofertasData: OfertasData
  propostaAccepted: boolean
  analiseData: AnaliseData
  cartaoData: CartaoData
  facialVerified: boolean
  dueDate: number | null
  email: string
  phone: string
  contactComplete: boolean
  facialPhoto: string
  saqueComplete: boolean
  withdrawnAmount: number
  pendingTacSaqueAmount: number | null
}

const STORAGE_KEY = 'supersim-flow'

const defaultOfertasData: OfertasData = {
  loanPurpose: '',
  occupation: '',
  monthlyIncome: '',
  paymentDay: '',
  education: '',
  cpfSituation: '',
}

const defaultAnaliseData: AnaliseData = {
  answers: [],
  pixType: '',
  pixKey: '',
  bankName: '',
  selectedInstallments: 0,
  selectedMonthlyPayment: 0,
  analiseComplete: false,
}

export const defaultCartaoData: CartaoData = {
  depositAmount: MIN_DEPOSIT,
  depositPaid: false,
  depositPaidAt: null,
  depositReleased: false,
  holderName: '',
  zip: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  dataComplete: false,
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  tacPaid: false,
  tacPaidAt: null,
  tacSubmittedAt: null,
  tacExpectedReleaseAt: null,
  applePayAdded: false,
  googlePayAdded: false,
}

const defaultState: FlowState = {
  objective: null,
  cpf: '',
  nome: '',
  motherName: '',
  birthDate: '29/05/1977',
  loanAmount: 10000,
  verificationStep: 1,
  ofertasStep: 1,
  ofertasData: defaultOfertasData,
  propostaAccepted: false,
  analiseData: defaultAnaliseData,
  cartaoData: defaultCartaoData,
  facialVerified: false,
  dueDate: null,
  email: '',
  phone: '',
  contactComplete: false,
  facialPhoto: '',
  saqueComplete: false,
  withdrawnAmount: 0,
  pendingTacSaqueAmount: null,
}

function loadState(): FlowState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaultState,
        ...parsed,
        ofertasData: { ...defaultOfertasData, ...parsed.ofertasData },
        analiseData: { ...defaultAnaliseData, ...parsed.analiseData },
        cartaoData: { ...defaultCartaoData, ...parsed.cartaoData },
      }
    }
  } catch {
    /* ignore */
  }
  return defaultState
}

interface FlowContextValue extends FlowState {
  setObjective: (objective: Objective) => void
  setCpf: (cpf: string) => void
  setNome: (nome: string) => void
  setMotherName: (name: string) => void
  setBirthDate: (date: string) => void
  setLoanAmount: (amount: number) => void
  setVerificationStep: (step: 1 | 2 | 3 | 4) => void
  setOfertasStep: (step: 1 | 2 | 3 | 4 | 5) => void
  updateOfertasData: (patch: Partial<OfertasData>) => void
  resetVerification: () => void
  startVerification: () => void
  startOfertas: () => void
  acceptProposta: () => void
  updateAnaliseData: (patch: Partial<AnaliseData>) => void
  completeAnalise: () => void
  updateCartaoData: (patch: Partial<CartaoData>) => void
  payCardDeposit: (amount: number) => void
  completeCardData: () => void
  payTac: () => void
  submitTacTransfer: (saqueAmount: number) => void
  addToWallet: (type: 'apple' | 'google') => void
  releaseDepositIfDelivered: () => void
  setFacialVerified: (value: boolean) => void
  setDueDate: (day: number) => void
  setContact: (email: string, phone: string) => void
  completeContact: () => void
  setFacialPhoto: (photo: string) => void
  completeSaque: (amount: number) => void
  resetFlow: () => void
}

const FlowContext = createContext<FlowContextValue | null>(null)

function persist(state: FlowState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(loadState)

  const update = useCallback((patch: Partial<FlowState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      persist(next)
      return next
    })
  }, [])

  const value = useMemo<FlowContextValue>(
    () => ({
      ...state,
      setObjective: (objective) => update({ objective }),
      setCpf: (cpf) => update({ cpf }),
      setNome: (nome) => update({ nome }),
      setMotherName: (motherName) => update({ motherName }),
      setBirthDate: (birthDate) => update({ birthDate }),
      setLoanAmount: (loanAmount) => update({ loanAmount }),
      setVerificationStep: (verificationStep) => update({ verificationStep }),
      setOfertasStep: (ofertasStep) => update({ ofertasStep }),
      updateOfertasData: (patch) => {
        setState((prev) => {
          const next = {
            ...prev,
            ofertasData: { ...prev.ofertasData, ...patch },
          }
          persist(next)
          return next
        })
      },
      resetVerification: () =>
        update({
          verificationStep: 1,
          cpf: '',
          nome: '',
          motherName: '',
          birthDate: defaultState.birthDate,
        }),
      startVerification: () =>
        update({
          verificationStep: 1,
          cpf: '',
          nome: '',
          motherName: '',
          birthDate: defaultState.birthDate,
        }),
      startOfertas: () =>
        update({
          ofertasStep: 1,
          ofertasData: defaultOfertasData,
        }),
      acceptProposta: () => update({ propostaAccepted: true }),
      updateAnaliseData: (patch) => {
        setState((prev) => {
          const next = {
            ...prev,
            analiseData: { ...prev.analiseData, ...patch },
          }
          persist(next)
          return next
        })
      },
      completeAnalise: () => {
        setState((prev) => {
          const next = {
            ...prev,
            analiseData: { ...prev.analiseData, analiseComplete: true },
          }
          persist(next)
          return next
        })
      },
      updateCartaoData: (patch) => {
        setState((prev) => {
          const next = {
            ...prev,
            cartaoData: { ...prev.cartaoData, ...patch },
          }
          persist(next)
          return next
        })
      },
      payCardDeposit: (amount) => {
        setState((prev) => {
          const now = new Date().toISOString()
          const next = {
            ...prev,
            cartaoData: {
              ...prev.cartaoData,
              depositAmount: amount,
              depositPaid: true,
              depositPaidAt: now,
              cardNumber: prev.cartaoData.cardNumber || generateCardNumber(prev.cpf),
              cardExpiry: prev.cartaoData.cardExpiry || generateCardExpiry(),
              cardCvv: prev.cartaoData.cardCvv || generateCardCvv(prev.cpf),
            },
          }
          persist(next)
          return next
        })
      },
      completeCardData: () => {
        setState((prev) => {
          const next = {
            ...prev,
            cartaoData: { ...prev.cartaoData, dataComplete: true },
          }
          persist(next)
          return next
        })
      },
      submitTacTransfer: (saqueAmount) => {
        setState((prev) => {
          const mockDelay =
            TAC_MOCK_RELEASE_MS_MIN +
            Math.random() * (TAC_MOCK_RELEASE_MS_MAX - TAC_MOCK_RELEASE_MS_MIN)
          const now = Date.now()
          const next = {
            ...prev,
            pendingTacSaqueAmount: saqueAmount,
            cartaoData: {
              ...prev.cartaoData,
              tacSubmittedAt: new Date(now).toISOString(),
              tacExpectedReleaseAt: new Date(now + mockDelay).toISOString(),
            },
          }
          persist(next)
          return next
        })
      },
      payTac: () => {
        setState((prev) => {
          const next = {
            ...prev,
            pendingTacSaqueAmount: null,
            cartaoData: {
              ...prev.cartaoData,
              tacPaid: true,
              tacPaidAt: new Date().toISOString(),
            },
          }
          persist(next)
          return next
        })
      },
      addToWallet: (type) => {
        setState((prev) => {
          const next = {
            ...prev,
            cartaoData: {
              ...prev.cartaoData,
              applePayAdded: type === 'apple' ? true : prev.cartaoData.applePayAdded,
              googlePayAdded: type === 'google' ? true : prev.cartaoData.googlePayAdded,
            },
          }
          persist(next)
          return next
        })
      },
      releaseDepositIfDelivered: () => {
        setState((prev) => {
          if (!prev.cartaoData.depositPaid || prev.cartaoData.depositReleased) return prev
          const { depositPaidAt } = prev.cartaoData
          if (!depositPaidAt) return prev
          const eta = new Date(depositPaidAt)
          eta.setDate(eta.getDate() + 7)
          if (new Date() < eta) return prev
          const next = {
            ...prev,
            cartaoData: { ...prev.cartaoData, depositReleased: true },
          }
          persist(next)
          return next
        })
      },
      setFacialVerified: (facialVerified) => update({ facialVerified }),
      setDueDate: (dueDate) => update({ dueDate }),
      setContact: (email, phone) => update({ email, phone }),
      completeContact: () => update({ contactComplete: true }),
      setFacialPhoto: (facialPhoto) => update({ facialPhoto }),
      completeSaque: (amount) => {
        setState((prev) => {
          const next = {
            ...prev,
            saqueComplete: true,
            withdrawnAmount: prev.withdrawnAmount + amount,
          }
          persist(next)
          return next
        })
      },
      resetFlow: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState(defaultState)
      },
    }),
    [state, update],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
