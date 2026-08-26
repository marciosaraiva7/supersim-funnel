# SDD 04 — Aceitação Fase 1

Checklist para validar conclusão da Fase 1.

## Design Reference

- [x] `design-reference/assets/` com logo, ilustração caps, supericon
- [x] `design-reference/tokens/` (cores, tipografia, spacing)
- [x] `design-reference/inventory.md`
- [x] HTML fonte: caps, inicio, verificacao
- [x] Screenshots side-by-side em `design-reference/screenshots/` (capturar com `npm run screenshots`)

## Funil navegável (mock)

| Rota | Tela | Status |
|------|------|--------|
| `/caps` | S01 Objetivo | OK |
| overlay | L01 Loading 850ms | OK |
| `/inicio` | S02 Landing | OK |
| `/verificacao` step 1 | S03 CPF | OK |
| `/verificacao` step 2 | S04 Identidade | OK |
| `/verificacao` step 3 | S05 Nascimento | OK |
| `/verificacao` step 4 | L02 Conclusão | OK |

## Comportamentos mock

- [x] Continuar disabled até selecionar objetivo
- [x] CPF 11 dígitos avança step 2
- [x] Mock retorna nome `Maria`, data `29/05/1977`
- [x] Seleção nome da mãe avança step 3
- [x] Sim → L02 com mensagem personalizada
- [x] Não → volta step 1 (CPF)
- [x] Toast social proof rotativo
- [x] Simulador recalcula parcela, taxa fixa 0,81%
- [x] `startVerification()` ao clicar Solicitar Agora
- [x] Simular header scrolla para simulador

## Visual

- [x] Baloo 2 global
- [x] Assets reais (sem placeholders)
- [x] Progress bar 78% (caps), 25/50/75/100% (verificação)
- [x] Card selecionado laranja com sombra
- [x] Botão Não vermelho (#F84D4D)
- [x] Framer Motion em steps e loading

## Acessibilidade básica

- [x] `role="radiogroup"` nos objetivos e nomes da mãe
- [x] `aria-checked` nos radio cards
- [x] `htmlFor` no label CPF
- [x] `aria-live` no toast

## Build

```bash
cd web && npm run build
```

## Fora de escopo (Fase 2+)

- Tela `/3/` ofertas pós-L02
- APIs reais
- UTMs / analytics
- Deploy produção
