export interface AdBanner {
  id: string
  image: string
  alt: string
  title: string
  description: string
  /** Posicionamento da imagem dentro do slide. */
  objectPosition?: string
  /** `contain` preserva a arte inteira; `cover` preenche o slide. */
  objectFit?: 'cover' | 'contain'
  /** Cor de fundo quando a imagem não preenche o slide. */
  backgroundColor?: string
}

export const AD_BANNERS: AdBanner[] = [
  {
    id: 'emprestimo-garantia-celular',
    image: '/assets/ads/emprestimo-garantia-celular.png',
    alt: 'Empréstimo com garantia de celular',
    title: 'Empréstimo com garantia de celular',
    description: 'Use seu smartphone como garantia e receba crédito na hora.',
    objectFit: 'contain',
    objectPosition: 'center',
    backgroundColor: '#F9D024',
  },
  {
    id: 'emprestimo-sem-garantia',
    image: '/assets/ads/emprestimo-sem-garantia.png',
    alt: 'Empréstimo sem garantia',
    title: 'Empréstimo sem garantia',
    description: 'Dinheiro rápido, 100% digital e sem burocracia.',
    objectFit: 'contain',
    objectPosition: 'center',
    backgroundColor: '#F0630A',
  },
  {
    id: 'emprestimo-agora-na-conta',
    image: '/assets/ads/emprestimo-agora-na-conta.png',
    alt: 'Chama no PIX — empréstimo agora na conta',
    title: 'Chama no PIX!',
    description: 'Saque imediato via PIX direto na sua conta SuperSim.',
    objectFit: 'cover',
    objectPosition: 'center',
    backgroundColor: '#F0630A',
  },
  {
    id: 'aumentar-score-serasa',
    image: '/assets/ads/aumentar-score-serasa.jpg',
    alt: 'Como aumentar score Serasa rapidamente',
    title: 'Aumente seu score Serasa',
    description: 'Dicas práticas para melhorar seu crédito em 2026.',
    objectFit: 'cover',
    objectPosition: 'center 35%',
    backgroundColor: '#E8A87C',
  },
]
