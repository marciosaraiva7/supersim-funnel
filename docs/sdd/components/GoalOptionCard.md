# SDD Component — GoalOptionCard

Radio card para seleção de objetivo.

## Props

```typescript
interface GoalOptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}
```

## Estados

- Default: white bg, border #ECE7E1, radio outline
- Selected: bg #FF7A1E, white text, shadow laranja, radio filled white
