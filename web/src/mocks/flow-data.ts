export const OBJECTIVES = [
  { id: 'pessoal' as const, emoji: '🙂', label: 'Uso Pessoal' },
  { id: 'negocio' as const, emoji: '🏢', label: 'Para Meu Negócio' },
]

export const LOAN = {
  min: 1000,
  max: 30000,
  default: 10000,
  installments: 120,
  rateLabel: '0,81% a.m.',
}

export const MOCK_CPF_RESPONSE = {
  nome: 'Maria',
  nomeMae: 'MARIA APARECIDA DOS SANTOS',
  dataNasc: '29/05/1977',
}

export const SOCIAL_PROOF_NAMES = {
  firstNames: [
    'José', 'João', 'Carlos', 'Pedro', 'Lucas', 'Marcos', 'Rafael', 'Bruno',
    'Felipe', 'Gabriel', 'Mariana', 'Ana', 'Fernanda', 'Juliana', 'Camila',
    'Patrícia', 'Aline', 'Renata', 'Beatriz', 'Larissa',
  ],
  lastNames: [
    'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Rodrigues',
    'Almeida', 'Nascimento', 'Carvalho', 'Gomes', 'Martins', 'Araújo',
    'Melo', 'Barbosa',
  ],
  cities: [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
    'Salvador', 'Fortaleza', 'Recife', 'Brasília', 'Campinas', 'Goiânia',
    'Manaus', 'Belém', 'Florianópolis', 'Natal',
  ],
}

export const MOTHER_OPTIONS = [
  'MARIA MADALENA T MOREIRA',
  'MARIA APARECIDA DOS SANTOS',
  'NENHUMA DAS ALTERNATIVAS',
  'ANA PAULA OLIVEIRA',
]

export const BENEFITS = [
  {
    title: 'Crédito na Hora',
    text: 'Aprovação em minutos e dinheiro em até 24h',
    icon: 'zap',
  },
  {
    title: 'Taxas a partir de 0,81%',
    text: 'As menores taxas do mercado garantidas',
    icon: 'currency',
  },
  {
    title: '100% Seguro',
    text: 'Processo digital protegido e regulamentado',
    icon: 'shield',
  },
  {
    title: 'Sem Fiador',
    text: 'Sem burocracia, sem garantias exigidas',
    icon: 'clipboard',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Maria Silva',
    city: 'São Paulo, SP',
    initial: 'M',
    quote:
      'Consegui meu empréstimo em menos de 24 horas! O processo foi super simples e a taxa é a melhor que encontrei. Recomendo demais!',
  },
  {
    name: 'João Santos',
    city: 'Rio de Janeiro, RJ',
    initial: 'J',
    quote:
      'Já tentei em vários bancos e sempre tinha muita burocracia. Aqui foi diferente! Tudo online, rápido e transparente.',
  },
]


export const FOOTER = {
  company: 'SuperSim Soluções Financeiras S.A.',
  cnpj: 'CNPJ: 02.038.232/0001-64 – São Paulo, SP – 01310-200',
}
