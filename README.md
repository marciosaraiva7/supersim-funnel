# SuperSim Clone

Clone do funil SuperSim com React + Tailwind + shadcn, dados mockados.

## Como rodar

```bash
cd web
npm install
npm run dev
```

Abra `http://localhost:5173/caps`

> Use **apenas um** servidor Vite por vez (porta 5173). Se houver conflito, encerre processos antigos antes de reiniciar.

### Regenerar screenshots de referência

```bash
npm run dev   # em outro terminal, porta 5173
npm run screenshots
```

### Testes

```bash
npm run test:unit
npm run dev   # em outro terminal
npm run test:smoke
```

## Mapa SDD ↔ Rotas

| SDD | Rota |
|-----|------|
| S01 Objetivo | `/caps` |
| L01 Loading | overlay em `/caps` |
| S02 Início | `/inicio` |
| S03–L02 Verificação | `/verificacao` (steps 1–4) |
| S06 Ofertas | `/ofertas` (steps 1–5) |
| S07 Proposta | `/proposta` |
| S08 Análise | `/analise` |
| S09 Facial | `/facial` |
| S10 Vencimento | `/vencimento` |
| S11 Confirmação | `/confirmacao` |
| S12 Criando | `/criando` |
| S13 Conta | `/conta` |
| S14 Cartão | `/cartao` |

## Fluxo completo

```
/caps → /inicio → /verificacao → /ofertas → /proposta → /analise → /facial → /vencimento → /confirmacao → /criando → /conta → /cartao
```

## Fases

- **Fase 1** — [`docs/sdd/04-phase1-acceptance.md`](docs/sdd/04-phase1-acceptance.md)
- **Fase 2** — [`docs/sdd/06-phase2-acceptance.md`](docs/sdd/06-phase2-acceptance.md)
- **Fase 3** — [`docs/sdd/08-phase3-acceptance.md`](docs/sdd/08-phase3-acceptance.md)
- **Fase 4** — [`docs/sdd/10-phase4-acceptance.md`](docs/sdd/10-phase4-acceptance.md)

## Documentação

- Design reference: [`design-reference/`](design-reference/)
- Especificações SDD: [`docs/sdd/`](docs/sdd/)

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS 4
- Framer Motion
- Baloo 2
