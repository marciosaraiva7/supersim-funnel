# SDD Component — LoanSimulator

Slider de valor do empréstimo.

## Props

```typescript
interface LoanSimulatorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number; // 1000
  max?: number; // 30000
}
```

## Display

- Valor formatado: `R$ 10.000`
- Parcelas: `120x R$ 131` (recalculado)
- Taxa fixa: `0,81% a.m.`
- Labels slider: `R$ 1.000` — `R$ 30.000`

## Visual

- Background: #FFFBEB
- Track laranja, thumb branco circular
