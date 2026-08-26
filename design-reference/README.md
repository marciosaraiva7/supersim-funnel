# Design Reference — SuperSim Clone

Pasta de referência visual para clonagem pixel-fiel do funil em [supersimv2.netlify.app](https://supersimv2.netlify.app).

## Como usar

1. Compare cada tela implementada com o screenshot correspondente em `screenshots/`.
2. Use tokens em `tokens/` para cores, tipografia e espaçamento.
3. Use assets reais em `assets/` — não substituir por placeholders genéricos.
4. Consulte `inventory.md` para componentes reutilizáveis.

## Screenshots

| Arquivo | Tela | Rota |
|---------|------|------|
| `S01-objetivo-idle.png` | Objetivo (sem seleção) | `/caps` |
| `S01-objetivo-selected.png` | Objetivo (Uso Pessoal selecionado) | `/caps` |
| `S02-inicio.png` | Landing pré-aprovado | `/inicio` |
| `S03-cpf.png` | Verificação CPF | `/verificacao` step 1 |
| `S04-identidade.png` | Verificação identidade | `/verificacao` step 2 |
| `S05-nascimento.png` | Confirmação nascimento | `/verificacao` step 3 |
| `S06-ofertas-step1.png` | Ofertas step 1 | `/ofertas` |
| `S06-ofertas-step2.png` | Ofertas step 2 | `/ofertas` |
| `S07-proposta.png` | Proposta Ingrid Torres | `/proposta` |
| `S08-analise-chat.png` | Chat análise | `/analise` |
| `S09-facial-consent.png` | Facial consentimento | `/facial` |
| `S10-vencimento-terms.png` | Vencimento | `/vencimento` |
| `S11-confirmacao.png` | Confirmação contato | `/confirmacao` |
| `S12-criando.png` | Splash criando conta | `/criando` |
| `S13-conta-home.png` | Conta digital home | `/conta` |

## HTML de referência

- `caps-source.html` — tela objetivo
- `inicio-source.html` — landing completa
- `verificacao-source.html` — wizard de verificação
- `analise-source.html` — chat análise
- `criando-source.html` — splash criando conta
- `conta-source.html` — conta digital

## Assets em `assets/`

| Arquivo | Uso |
|---------|-----|
| `caps-illustration.png` | Ilustração hero da tela Objetivo |
| `supersim-logo.svg` | Logo oficial SuperSim |
| `supericon.png` | Ícone toast social proof |
| `attendant.png` | Avatar atendente (proposta/facial fallback) |
