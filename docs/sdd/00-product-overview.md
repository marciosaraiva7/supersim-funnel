# SDD 00 — Product Overview

## Objetivo

Clonar o funil de simulação SuperSim (referência: supersimv2.netlify.app) com fidelidade visual e fluxo navegável, usando dados mockados.

## Escopo

### Fase 1 — Concluída

- 7 telas/estados: S01, L01, S02, S03, S04, S05, L02
- Design system com Baloo 2
- Assets reais (logo, ilustração caps, supericon)
- Checklist: `04-phase1-acceptance.md`

### Fase 2 — Concluída

- S06 Ofertas (`/ofertas`) — wizard 5 steps
- S07 Proposta (`/proposta`) — mock Ingrid Torres
- UTM persistence + back redirect
- L02 → `/ofertas` após 3s
- Checklist: `06-phase2-acceptance.md`

### Fase 3 — Concluída

- S08 Análise (`/analise`) — chat WhatsApp mock
- S09 Facial (`/facial`) — verificação facial
- S10 Vencimento (`/vencimento`) — condições + dia
- S11 Confirmação (`/confirmacao`) — e-mail e telefone
- Checklist: `08-phase3-acceptance.md`

### Fase 4 — Concluída

- Chat análise completo: PIX receipt, confirmação "SIM", confetti
- Facial com câmera real + fallback mock
- S12 Criando (`/criando`) — splash animado
- S13 Conta (`/conta`) — home, saque, dados
- Polish: CPF validado, menu/sino mock, resetFlow
- Checklist: `10-phase4-acceptance.md`

## Fora de escopo

- APIs reais de bureau/crédito
- Autenticação
- `/final`, `/ups/*`
- Deploy produção
- Analytics (Clarity, TikTok, Facebook)

## Stack

- Vite + React 19 + TypeScript
- React Router 7
- Tailwind CSS 4 + shadcn/ui
- Framer Motion
- FlowContext + localStorage

## Rotas

| Rota | Tela |
|------|------|
| `/` | redirect → `/caps` |
| `/caps` | S01 Objetivo |
| `/inicio` | S02 Landing |
| `/verificacao` | S03–S05 + L02 (wizard) |
| `/ofertas` | S06 Informações do Empréstimo |
| `/proposta` | S07 Proposta / Ingrid Torres |
| `/analise` | S08 Chat análise de crédito |
| `/facial` | S09 Verificação facial |
| `/vencimento` | S10 Condições + vencimento |
| `/confirmacao` | S11 Dados de contato |
| `/criando` | S12 Splash criando conta |
| `/conta` | S13 Conta digital |
| `/concluido` | redirect → `/criando` |

## Critério de sucesso

Match visual side-by-side com screenshots em `design-reference/screenshots/` em viewport 430×932.
