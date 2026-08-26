# SDD S06 — Ofertas (Informações do Empréstimo)

## Metadados

| Campo | Valor |
|-------|-------|
| ID | S06 |
| Rota | `/ofertas` |
| Original | `/3/` |
| Ordem | 8 |

## Steps

| Step | Título | Validação |
|------|--------|-----------|
| 1 | Finalidade do Empréstimo | Seleção obrigatória |
| 2 | Ocupação | Seleção obrigatória |
| 3 | Renda e Dia de Recebimento | Renda + dia 1–31 |
| 4 | Escolaridade | Seleção obrigatória |
| 5 | Situação do CPF | Seleção obrigatória |

## Header

- Logo SuperSim
- Nome: primeiro + último do FlowContext
- CPF mascarado: `123.***.***-01`

## Navegação

- Entrada: redirect automático de L02 (3s)
- Saída step 5: success → `/proposta` (1.5s)

## Progress

- `step de 5` + barra `(step/5)*100%`

## Copy exata step 5 reassurance

`Não se preocupe! Trabalhamos com pessoas em qualquer situação de crédito`

## Trust bar

`Suas informações são utilizadas apenas para análise de crédito.`
