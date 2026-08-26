import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../../design-reference/screenshots')
const base = process.env.DEV_URL ?? 'http://localhost:5173'

async function capture(page, url, filename) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(600)
  await page.screenshot({
    path: path.join(outDir, filename),
    fullPage: true,
  })
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 430, height: 932 } })
const page = await context.newPage()

await capture(page, `${base}/caps`, 'S01-objetivo-idle.png')
await page.getByRole('radio', { name: /Uso Pessoal/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: path.join(outDir, 'S01-objetivo-selected.png'), fullPage: true })

await capture(page, `${base}/inicio`, 'S02-inicio.png')

await page.goto(`${base}/verificacao`, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.removeItem('supersim-flow'))
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S03-cpf.png'), fullPage: true })

await page.getByPlaceholder('000.000.000-00').fill('52998224725')
await page.getByRole('button', { name: 'Verificar meu CPF' }).click()
await page.getByRole('radio', { name: 'MARIA APARECIDA DOS SANTOS' }).waitFor({ timeout: 15_000 })
await page.waitForTimeout(300)
await page.screenshot({ path: path.join(outDir, 'S04-identidade.png'), fullPage: true })

await page.getByRole('radio', { name: 'MARIA APARECIDA DOS SANTOS' }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: path.join(outDir, 'S05-nascimento.png'), fullPage: true })

await page.evaluate(() => {
  localStorage.setItem(
    'supersim-flow',
    JSON.stringify({
      objective: 'pessoal',
      cpf: '529.982.247-25',
      nome: 'MARIA APARECIDA DOS SANTOS',
      motherName: 'MARIA APARECIDA DOS SANTOS',
      birthDate: '29/05/1977',
      loanAmount: 10000,
      verificationStep: 4,
      ofertasStep: 1,
      ofertasData: {
        loanPurpose: '',
        occupation: '',
        monthlyIncome: '',
        paymentDay: '',
        education: '',
        cpfSituation: '',
      },
    }),
  )
})
await page.goto(`${base}/ofertas`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S06-ofertas-step1.png'), fullPage: true })

await page.getByRole('button', { name: 'Pagar dívidas' }).click()
await page.getByRole('button', { name: 'Continuar' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(outDir, 'S06-ofertas-step2.png'), fullPage: true })

await page.evaluate(() => {
  const raw = localStorage.getItem('supersim-flow')
  const state = JSON.parse(raw)
  state.ofertasStep = 5
  state.ofertasData = {
    loanPurpose: 'Pagar dívidas',
    occupation: 'Empregado CLT',
    monthlyIncome: 'R$ 3.000 a R$ 5.000',
    paymentDay: '5',
    education: 'Médio',
    cpfSituation: 'Limpo',
  }
  localStorage.setItem('supersim-flow', JSON.stringify(state))
})
await page.goto(`${base}/proposta`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S07-proposta.png'), fullPage: true })

await page.evaluate(() => {
  const raw = localStorage.getItem('supersim-flow')
  const state = JSON.parse(raw)
  state.propostaAccepted = true
  state.analiseData = { ...state.analiseData, analiseComplete: true }
  state.facialVerified = true
  state.dueDate = 10
  localStorage.setItem('supersim-flow', JSON.stringify(state))
})

await page.goto(`${base}/analise`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, 'S08-analise-chat.png'), fullPage: true })

await page.goto(`${base}/facial`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S09-facial-consent.png'), fullPage: true })

await page.goto(`${base}/vencimento`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S10-vencimento-terms.png'), fullPage: true })

await page.goto(`${base}/confirmacao`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S11-confirmacao.png'), fullPage: true })

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

await page.evaluate((seed) => {
  localStorage.setItem('supersim-flow', JSON.stringify(seed))
}, fullFlowSeed)
await page.reload({ waitUntil: 'networkidle' })

await page.goto(`${base}/criando`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(outDir, 'S12-criando.png'), fullPage: true })

await page.evaluate((seed) => {
  localStorage.setItem('supersim-flow', JSON.stringify(seed))
}, fullFlowSeed)
await page.reload({ waitUntil: 'networkidle' })
await page.goto(`${base}/conta`, { waitUntil: 'domcontentloaded' })
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
await page.getByRole('button', { name: 'Acessar minha conta' }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'S13-conta-home.png'), fullPage: true })

await browser.close()
console.log('Screenshots saved to', outDir)
