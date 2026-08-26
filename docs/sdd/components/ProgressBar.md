# SDD Component — ProgressBar

Barra horizontal no topo (caps) ou dentro do card (verificação).

## Props

```typescript
interface ProgressBarProps {
  value: number; // 0-100
  height?: 'sm' | 'md'; // sm=4px, md=6px
  animated?: boolean;
}
```

## Visual

- Track: `#ECE7E1` ou `#E5E7EB`
- Fill: gradient `#F0630A` → `#FF7A1E`
- Border-radius right on fill
