# SDD 06 — Fase 2 Acceptance Checklist

## Fluxo

- [x] L02 em `/verificacao` redireciona para `/ofertas` após 3s
- [x] `/ofertas` exige CPF preenchido (redirect para `/verificacao` se vazio)
- [x] Wizard `/ofertas` com 5 steps e validação por step
- [x] Step 5 concluído → success → `/proposta` após 1.5s
- [x] `/proposta` exige ofertas completas (redirect para `/ofertas` se incompleto)

## UTMs e navegação

- [x] UTMs capturadas na query e persistidas em `localStorage`
- [x] Navegação preserva UTMs (`buildUrlWithUtms`)
- [x] Back em `/inicio` redireciona para `/caps`

## UI

- [x] Header Ofertas/Proposta com nome + CPF mascarado
- [x] Copy exata dos steps de ofertas e página Ingrid Torres
- [x] Asset `attendant.png` carregando

## Build e referência

- [x] `npm run build` passa
- [x] Screenshots S06 e S07 em `design-reference/screenshots/`

## Comandos

```bash
cd web
npm run dev
npm run build
npm run screenshots  # dev server em outro terminal
```
