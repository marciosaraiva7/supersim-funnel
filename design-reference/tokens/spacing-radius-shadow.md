# Tokens — Espaçamento, Radius, Shadow

## Container

| Token | Valor |
|-------|-------|
| Max width mobile | `430px` |
| Padding horizontal | `24px` (caps), `20px` (verificação) |
| Min height | `100vh` / `100dvh` |

## Border radius

| Elemento | Valor |
|----------|-------|
| Option cards | `16px` |
| CTA buttons | `16px` |
| Header CTA pill | `100px` |
| Main card | `18px` (`--radius`) |
| Menu icon | `12px` |
| Toast | `12px` |
| Input | `14px` |

## Spacing

| Contexto | Valor |
|----------|-------|
| Gap entre options | `14px` |
| CTA padding | `18px` |
| Card padding | `24px` |
| Section gap | `16–24px` |
| Hero padding top | `120px` (com header fixo) |

## Shadows

```css
/* Card selecionado */
box-shadow: 0 10px 24px -10px rgba(240, 99, 10, 0.55);

/* CTA ativo */
box-shadow: 0 14px 28px -12px rgba(240, 99, 10, 0.6);

/* Card principal */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

/* Header CTA */
box-shadow: 0 3px 12px rgba(251, 150, 55, 0.35);
```

## Progress bar

| Contexto | Altura | Fill |
|----------|--------|------|
| Caps top | `6px` | 78% inicial |
| Verificação | `4px` | 25% / 50% / 75% / 100% por step |
