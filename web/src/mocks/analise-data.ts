export interface AnaliseQuestion {
  text: string
  options: string[]
  type?: 'pix'
}

export const ANALISE_QUESTIONS: AnaliseQuestion[] = [
  {
    text: 'Olá! Para finalizar sua análise, preciso fazer algumas perguntas rápidas. Qual o principal motivo do seu empréstimo?',
    options: ['Pagar dívidas', 'Investir no negócio', 'Reformar a casa', 'Emergência médica'],
  },
  {
    text: 'Perfeito! Você possui conta bancária ativa em seu nome?',
    options: [
      'Sim, em banco tradicional',
      'Sim, em banco digital',
      'Sim, em ambos',
      'Vou abrir uma conta',
    ],
  },
  {
    text: 'Ótimo! Agora preciso saber onde você quer receber o dinheiro. Qual tipo de chave PIX você prefere usar?',
    options: ['CPF/CNPJ', 'Celular', 'E-mail', 'Chave Aleatória'],
    type: 'pix',
  },
  {
    text: 'Última pergunta! Quando pretende começar a pagar as parcelas?',
    options: ['No próximo mês', 'Em 30 dias', 'Em 60 dias', 'Em 90 dias'],
  },
]

export const INSTALLMENT_OPTIONS = [3, 6, 12, 24, 36, 48, 60, 120]

export function calcInstallmentValue(amount: number, months: number, rate = 0.0081) {
  const factor = Math.pow(1 + rate, months)
  return (amount * (rate * factor)) / (factor - 1)
}
