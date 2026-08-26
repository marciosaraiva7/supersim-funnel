# SDD S12 — Criando conta

## Rota

`/criando`

## Referência

- HTML: `design-reference/criando-source.html`
- Screenshot: `design-reference/screenshots/S12-criando.png`

## Comportamento

- Guard: exige `cpf` + `contactComplete`
- Splash full-screen com logo, nome, valor reservado
- Spinner + status rotativo (4 mensagens)
- Checklist animada (4 itens)
- Barra de progresso
- Após ~8,4s → redirect `/conta`

## Checklist copy

1. Conta criada com sucesso
2. Empréstimo aprovado e disponível
3. Saldo liberado para saque
4. PIX pronto para transferência
