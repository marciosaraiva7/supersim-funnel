# SDD 10 — Fase 4 Acceptance Checklist

## Chat `/analise`

- [x] Comprovante PIX após escolher parcelas
- [x] Confirmação digitando "SIM"
- [x] Loading → aprovação com confetti
- [x] Cards de parcelas com total
- [x] Autocomplete de banco

## Facial `/facial`

- [x] Câmera real via getUserMedia
- [x] Preview com foto capturada
- [x] Fallback mock se câmera indisponível

## Pós-confirmação

- [x] `/confirmacao` → `/criando`
- [x] Splash com checklist animada (4 itens)
- [x] Redirect automático para `/conta`

## Conta `/conta`

- [x] Home: saldo, toggle ocultar, quick actions, card empréstimo
- [x] Push overlay de boas-vindas
- [x] Notificações mock
- [x] Saque → confirmar → sucesso interno (sem `/final`)
- [x] Tab Dados + reiniciar simulação

## Polish

- [x] Menu mock nos headers
- [x] CPF com validação de dígitos
- [x] `/concluido` redireciona para `/criando`

## Build e QA

- [x] `npm run build` passa
- [x] `npm run test:unit` passa
- [x] `npm run test:smoke` passa
- [x] Screenshots S12–S13 gerados
