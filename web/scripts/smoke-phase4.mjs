import { chromium } from 'playwright'

const base = process.env.DEV_URL ?? 'http://localhost:5173'

const fullFlowSeed = {
  objective: 'pessoal',
  cpf: '529.982.247-25',
  nome: 'MARIA APARECIDA DOS SANTOS',
  motherName: 'MARIA APARECIDA DOS SANTOS',
  birthDate: '29/05/1977',
  loanAmount: 10000,
  verificationStep: 4,
  ofertasStep: 5,
  ofertasData: {
    loanPurpose: 'Pagar dívidas',
    occupation: 'Empregado CLT',
    monthlyIncome: 'R$ 3.000 a R$ 5.000',
    paymentDay: '5',
    education: 'Médio',
    cpfSituation: 'Limpo',
  },
  propostaAccepted: true,
  analiseData: {
    answers: ['Pagar dívidas', 'Sim, em banco tradicional', 'CPF/CNPJ', 'No próximo mês'],
    pixType: 'CPF/CNPJ',
    pixKey: '529.982.247-25',
    bankName: 'Nubank',
    selectedInstallments: 12,
    selectedMonthlyPayment: 950.42,
    analiseComplete: true,
  },
  facialVerified: true,
  dueDate: 10,
  email: 'maria@email.com',
  phone: '11999998888',
  contactComplete: true,
  facialPhoto: '',
  saqueComplete: false,
}

async function seedFlow(page) {
  await page.evaluate((seed) => {
    localStorage.setItem('supersim-flow', JSON.stringify(seed))
  }, fullFlowSeed)
  await page.reload({ waitUntil: 'networkidle' })
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 430, height: 932 } })
const page = await context.newPage()

await page.goto(`${base}/caps`, { waitUntil: 'domcontentloaded' })
await seedFlow(page)

await page.goto(`${base}/criando`, { waitUntil: 'domcontentloaded' })
await page.getByText('Configurando sua conta').waitFor({ timeout: 5000 })

await seedFlow(page)
await page.goto(`${base}/conta`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

await page.getByRole('button', { name: 'Acessar minha conta' }).click()
await page.getByText('Saldo disponível').waitFor({ timeout: 5000 })
await page.getByText('10.000').first().waitFor({ timeout: 5000 })

await browser.close()
console.log('Smoke Phase 4 OK: /criando → /conta com saldo visível')
