import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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
  facialVerified: boolean
  dueDate: number | null
  email: string
  phone: string
  contactComplete: boolean
  facialPhoto: string
  saqueComplete: boolean
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
  facialVerified: false,
  dueDate: null,
  email: '',
  phone: '',
  contactComplete: false,
  facialPhoto: '',
  saqueComplete: false,
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
  setFacialVerified: (value: boolean) => void
  setDueDate: (day: number) => void
  setContact: (email: string, phone: string) => void
  completeContact: () => void
  setFacialPhoto: (photo: string) => void
  completeSaque: () => void
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
      setFacialVerified: (facialVerified) => update({ facialVerified }),
      setDueDate: (dueDate) => update({ dueDate }),
      setContact: (email, phone) => update({ email, phone }),
      completeContact: () => update({ contactComplete: true }),
      setFacialPhoto: (facialPhoto) => update({ facialPhoto }),
      completeSaque: () => update({ saqueComplete: true }),
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
