import {
  CreditCard,
  Heart,
  TrendingUp,
  Home,
  ShoppingCart,
  Circle,
  Building2,
  Landmark,
  Wrench,
  Shield,
  HeartPulse,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  type LucideIcon,
} from 'lucide-react'

export const LOAN_PURPOSES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'Pagar dívidas', label: 'Pagar dívidas', icon: CreditCard },
  { value: 'Saúde', label: 'Emergência médica', icon: Heart },
  { value: 'Investimento', label: 'Meu negócio', icon: TrendingUp },
  { value: 'Reforma', label: 'Reformar casa', icon: Home },
  { value: 'Compras', label: 'Compras', icon: ShoppingCart },
  { value: 'Outros', label: 'Outros motivos', icon: Circle },
]

export const OCCUPATIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'Empregado CLT', label: 'Assalariado CLT', icon: Building2 },
  { value: 'Funcionário público', label: 'Servidor público', icon: Landmark },
  { value: 'Autônomo', label: 'Autônomo', icon: Wrench },
  { value: 'Empresário', label: 'Empresário / MEI', icon: Shield },
  { value: 'Aposentado/Pensionista', label: 'Aposentado / Pensionista', icon: HeartPulse },
  { value: 'Desempregado', label: 'Desempregado', icon: Users },
  { value: 'Dona de casa', label: 'Dona de casa', icon: Home },
  { value: 'Estudante', label: 'Estudante', icon: GraduationCap },
  { value: 'Rentista', label: 'Rentista', icon: CreditCard },
  { value: 'Outro', label: 'Outro', icon: Circle },
]

export const INCOME_OPTIONS = [
  'Até R$ 1.500',
  'R$ 1.500 a R$ 3.000',
  'R$ 3.000 a R$ 5.000',
  'R$ 5.000 a R$ 10.000',
  'Acima de R$ 10.000',
]

export const EDUCATION_LEVELS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'Fundamental', label: 'Ensino Fundamental', icon: BookOpen },
  { value: 'Médio', label: 'Ensino Médio', icon: GraduationCap },
  { value: 'Superior', label: 'Ensino Superior', icon: Award },
  { value: 'Pós-Graduação', label: 'Pós-Graduação', icon: Award },
  { value: 'Outro', label: 'Outro', icon: Circle },
]

export const CPF_SITUATIONS = [
  {
    value: 'Negativado',
    title: 'Tenho algumas pendências',
    description: 'Nome negativado ou restrições no CPF',
    tone: 'danger' as const,
  },
  {
    value: 'Limpo',
    title: 'Meu nome está limpo',
    description: 'Sem restrições ou negativação',
    tone: 'success' as const,
  },
]
