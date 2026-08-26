# SDD 09 — Fase 4 Overview

## Objetivo

Fechar gaps de fidelidade mock até `/conta`, completando chat de análise, facial real, splash `/criando` e conta digital.

## Escopo Fase 4

| SDD | Rota | Original |
|-----|------|----------|
| S08 Análise (completo) | `/analise` | `/5/` |
| S09 Facial (câmera) | `/facial` | `/6/` |
| S12 Criando | `/criando` | `/criando/` |
| S13 Conta | `/conta` | `/conta/` |

## Melhorias transversais

- Comprovante PIX + confirmação "SIM" + confetti
- Autocomplete banco no chat
- Validação CPF com dígitos verificadores
- Menu/sino mock nos headers
- `resetFlow()` no FlowContext

## Fora de escopo

- `/final`, `/ups/*`
- APIs, auth, analytics, deploy

## Fluxo atualizado

```
/confirmacao → /criando → /conta (home | saque | dados)
```

## Critério de pronto

Ver [`10-phase4-acceptance.md`](10-phase4-acceptance.md)
