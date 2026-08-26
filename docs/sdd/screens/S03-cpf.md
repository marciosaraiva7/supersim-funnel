# SDD S03 — CPF

## Metadados

| Campo | Valor |
|-------|-------|
| ID | S03 |
| Rota | `/verificacao` step 1 |
| Ordem | 4 |
| Screenshot | `design-reference/screenshots/S03-cpf.png` |

## Objetivo

Coletar CPF para verificação mock.

## Layout

- AppHeader
- Card com Stepper (step 1 active, 25% progress)
- Ícone raio laranja
- H1: `Vamos começar!`
- Subtitle CPF
- Input mascarado
- Botão `Verificar meu CPF`
- Trust bar criptografia

## Validação mock

- 11 dígitos → avança step 2
- Loading 1s no botão

## Aceitação

- [ ] Máscara 000.000.000-00
- [ ] Stepper step 1 laranja
- [ ] Progress 25%
