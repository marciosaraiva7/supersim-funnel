# SDD S01 — Objetivo

## Metadados

| Campo | Valor |
|-------|-------|
| ID | S01 |
| Rota | `/caps` |
| Ordem | 1 |
| Screenshot | `design-reference/screenshots/S01-objetivo-idle.png`, `S01-objetivo-selected.png` |

## Objetivo

Capturar intenção do usuário: uso pessoal ou negócio.

## Layout

1. Progress bar (78% fill)
2. Ilustração caps + blob decorativo
3. H1 "Qual o seu objetivo?"
4. 2 GoalOptionCards
5. Spacer flex
6. CTA Continuar
7. Trust line
8. Footer © 2026

## Copy exata

- H1: `Qual o seu objetivo?`
- Opção 1: `🙂 Uso Pessoal`
- Opção 2: `🏢 Para Meu Negócio`
- CTA: `Continuar`
- Trust: `Consulta 100% segura e gratuita`
- Footer: `© 2026 · Página segura de simulação`

## Estados

| Estado | Comportamento |
|--------|---------------|
| idle | Nenhuma opção selecionada, CTA disabled (bg #ECE7E1, text #B7B0A6) |
| selected | Card laranja, CTA active gradient |
| loading | Overlay escuro + spinner + texto loading |

## Interações

- Click card → seleciona, ativa CTA
- Click Continuar (selected) → overlay L01 → navigate `/inicio` após 850ms

## Assets

- `design-reference/assets/caps-illustration.png`

## Aceitação

- [ ] Match visual idle e selected
- [ ] CTA disabled até seleção
- [ ] Progress bar 78% laranja
- [ ] Baloo 2 em todos textos
