# SDD 03 — Data Mocks

## Objetivo (S01)

```typescript
const OBJECTIVES = [
  { id: 'pessoal', emoji: '🙂', label: 'Uso Pessoal' },
  { id: 'negocio', emoji: '🏢', label: 'Para Meu Negócio' },
] as const;
```

## Loading (L01)

- Texto pessoal: "Preparando sua simulação pessoal..."
- Texto negócio: "Preparando sua simulação empresarial..."
- Default: "Preparando sua simulação..."
- Delay: 850ms

## Simulador (S02)

```typescript
const LOAN = {
  min: 1000,
  max: 30000,
  default: 10000,
  installments: 120,
  rate: 0.0081, // 0.81% a.m.
  defaultInstallment: 131,
};
```

Fórmula mock parcela: `Math.round((amount * rate * Math.pow(1 + rate, installments)) / (Math.pow(1 + rate, installments) - 1))`

## Verificação CPF (S03)

- CPF mock válido: qualquer 11 dígitos
- Resposta mock API:

```typescript
const MOCK_CPF_RESPONSE = {
  nome: 'USUARIO MOCK',
  nomeMae: 'MARIA APARECIDA DOS SANTOS',
  dataNasc: '29/05/1977',
};
```

## Identidade (S04)

Opções fixas do screenshot (quando API não retorna mãe):

```typescript
const MOTHER_OPTIONS = [
  'MARIA MADALENA T MOREIRA',
  'MARIA APARECIDA DOS SANTOS',
  'NENHUMA DAS ALTERNATIVAS',
  'ANA PAULA OLIVEIRA',
];
```

Resposta correta mock: `MARIA APARECIDA DOS SANTOS`

## Toast social proof

```typescript
const SOCIAL_PROOF = {
  name: 'Mariana Oliveira',
  city: 'Florianópolis',
  amount: 'R$ 4.550',
};
```

## Footer institucional

- Empresa: SuperSim Soluções Financeiras S.A.
- CNPJ: 02.038.232/0001-64 – São Paulo, SP – 01310-200

## Depoimentos

| Autor | Cidade | Quote |
|-------|--------|-------|
| Maria Silva | São Paulo, SP | Consegui meu empréstimo em menos de 24 horas!... |
| João Santos | Rio de Janeiro, RJ | Já tentei em vários bancos... |
