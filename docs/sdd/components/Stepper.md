# SDD Component — Stepper

4 steps: CPF, Identidade, Nascimento, Pronto.

## Props

```typescript
interface StepperProps {
  currentStep: 1 | 2 | 3 | 4;
}
```

## Estados por dot

- **pending:** circle outline cinza, label cinza
- **active:** circle laranja preenchido, label laranja
- **done:** circle laranja, label laranja

Step 4 usa ícone checkmark em vez de número.

## Lines

Conectores entre dots — laranja se step anterior done.
