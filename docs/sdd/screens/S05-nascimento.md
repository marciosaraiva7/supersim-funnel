# SDD S05 — Nascimento

## Metadados

| Campo | Valor |
|-------|-------|
| ID | S05 |
| Rota | `/verificacao` step 3 |
| Ordem | 6 |
| Screenshot | `design-reference/screenshots/S05-nascimento.png` |

## Objetivo

Confirmar data de nascimento mock.

## Copy

- H1: `Confirme seu nascimento`
- Sub: `Última etapa! Verifique se a data de nascimento abaixo está correta.`
- Data: `29/05/1977`
- Sim: `Sim, está correto`
- Não: `Não, está incorreto`

## Navegação

- Sim → L02 (step 4)
- Não → S03 (reset step 1)

## Aceitação

- [ ] Progress 75%
- [ ] Botão Sim laranja, Não vermelho #F84D4D
- [ ] Date display com ícone calendário
