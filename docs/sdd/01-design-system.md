# SDD 01 — Design System

## Visual thesis

Funil financeiro mobile-first, acolhedor e rounded — creme quente, laranja vibrante, Baloo 2, ilustração real como ancora.

## CSS Variables (Tailwind theme)

```css
:root {
  --orange: #FF7A1E;
  --orange-deep: #F0630A;
  --orange-soft: #FFF1E4;
  --primary: #FB9637;
  --primary-dark: #E8850A;
  --primary-subtle: #FFFBEB;
  --primary-light: #FEF3C7;
  --ink: #1C1B1A;
  --ink-soft: #6B6864;
  --line: #ECE7E1;
  --bg-caps: #FFFDF9;
  --bg-app: #F4F5F7;
  --card: #FFFFFF;
  --text: #111827;
  --text-mid: #374151;
  --text-light: #6B7280;
  --border: #E5E7EB;
  --danger: #F84D4D;
  --success: #2FAE7E;
  --radius: 18px;
}
```

## Tipografia

- Fonte: Baloo 2 (400–800)
- Headings: weight 700–800
- Body: weight 500–600

## Motion

1. **Entrada:** fadeUp 0.6s ease (opacity + translateY 10px)
2. **Seleção card:** translateY -1px + shadow laranja 0.22s
3. **Loading overlay:** fadeIn 0.2s + spinner rotate 0.7s
4. **Step transition:** AnimatePresence fade + slide 0.3s

## Componentes base

Ver `docs/sdd/components/` e `design-reference/inventory.md`.

## Regras

- Não inventar textos, logos ou ícones
- Cards existem onde a referência usa cards
- Max width 430px centralizado
