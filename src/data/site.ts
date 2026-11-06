// Conteúdo central do site. Edite aqui textos, contatos e links.
// Itens marcados com "CONFIRMAR" precisam ser validados com a Urbanizamos.

export const CTA_CONTATO = 'Falar no WhatsApp';
export const CTA_SIMULADOR = 'Simular parcelas';

export const site = {
  nome: 'Gran Lago',
  nomeCompleto: 'Gran Lago Condomínio Horizontal',
  url: 'https://condominiogranlago.com.br',
  titulo: 'Gran Lago | Condomínio horizontal com lago na GO-020, Goiânia',
  descricao:
    'Lotes no Gran Lago Condomínio Horizontal, na GO-020: lago, paisagismo biofílico e mais de 40 itens de lazer. Conheça, faça o tour 360 e simule suas parcelas.',
  gtm: 'GTM-W29KG9ZZ',
  googleVerification: '',

  contato: {
    // CONFIRMAR: (62) 9990-4335 tem só 8 dígitos; celular/WhatsApp costuma ter 9.
    whatsapp: '556299904335',
    whatsappMensagem: 'Olá! Vim pelo site e quero saber mais sobre o Gran Lago.',
    telefoneVendas: '(62) 9990-4335',
    telefoneVendasLink: '+556299904335',
    telefoneRelacionamento: '(62) 3142-5059',
    telefoneRelacionamentoLink: '+556231425059',
    horarioRelacionamento: 'Dias úteis, das 8h às 18h',
    enderecoVendas: 'Av. 136, Qd. F-42-A, Lt. 45, Setor Sul, Goiânia - GO, 74093-250',
    instagram: 'https://www.instagram.com/urbanizamos/',
  },

  links: {
    tour360: 'https://condominiogranlago.com.br/tour360/index.htm',
    simulador: 'https://gransimulador.netlify.app/simulador',
    urbanizamos: 'https://urbanizamos.com.br',
    vgv: 'https://maisvgvbrasil.com.br',
  },

  legal:
    'Loteamento do tipo fechado denominado Gran Lago Condomínio Horizontal, de responsabilidade da Vale do Jordão Empreendimentos LTDA, inscrita no CNPJ 50.215.980/0001-18. Empreendimento registrado sob a matrícula nº 27.286 no Cartório de Registro de Imóveis de Bela Vista de Goiás - GO. Todas as imagens constantes deste material são ilustrativas. Perspectivas artísticas preliminares, sujeitas a alteração.',
};

export const menu = [
  { label: 'O lugar', href: '/#conceito' },
  { label: 'Localização', href: '/#localizacao' },
  { label: 'Lazer', href: '/#lazer' },
  { label: 'Tour 360', href: '/#tour' },
  { label: 'Galeria', href: '/#galeria' },
  { label: 'Obras', href: '/#obras' },
];

export const destaques = [
  { valor: 40, prefixo: '+', sufixo: '', rotulo: 'itens de lazer distribuídos ao redor do lago' },
  { valor: 93, prefixo: '', sufixo: '%', rotulo: 'de valorização média dos lotes na GO-020 entre 2019 e 2024*' },
  { valor: 39, prefixo: '', sufixo: ' anos', rotulo: 'de experiência da Takeda Design no paisagismo biofílico' },
];

// Lazer agrupado por tema (a lista original tinha 42 itens com repetições).
export const lazer = [
  {
    tema: 'Natureza',
    titulo: 'O lago no centro de tudo',
    imagem: '/img/lazer-natureza.webp',
    itens: ['Lago', 'Camping', 'Casa na árvore', 'Praça de aromas', 'Alimentador de pássaros', 'Estar contemplação', 'Chafariz iluminado'],
  },
  {
    tema: 'Esporte',
    titulo: 'Para quem gosta de movimento',
    imagem: '/img/lazer-esporte.webp',
    itens: ['Quadras de beach tennis', 'Quadra de tênis', 'Campo society', 'Quadra poliesportiva', 'Pump track', 'Bike station', 'Estar de slackline'],
  },
  {
    tema: 'Bem-estar',
    titulo: 'Corpo e mente em equilíbrio',
    imagem: '/img/lazer-bemestar.webp',
    itens: ['Academia e piscina', 'Health care', 'Estar fitness', 'Estar refrescante', 'Estar para leitura'],
  },
  {
    tema: 'Gastronomia',
    titulo: 'Encontros com sabor',
    imagem: '/img/lazer-gastronomia.webp',
    itens: ['Espaços gourmet', 'BBQ lounges', 'Beer lounge', 'Wine lounge', 'Mall comercial'],
  },
  {
    tema: 'Família',
    titulo: 'Infância ao ar livre',
    imagem: '/img/lazer-familia.webp',
    itens: ['Playgrounds', 'Play aventura', 'Estar jogos', 'Praça de convívio', 'Praça de eventos com palco', 'Praça de ativações'],
  },
  {
    tema: 'Pet e serviços',
    titulo: 'Tudo pensado nos detalhes',
    imagem: '/img/lazer-servicos.webp',
    itens: ['Pet square', 'Estar pet', 'Portaria', 'Carregador para carro elétrico', 'Calibrador de pneus', 'Banheiros de apoio'],
  },
];

export const diferenciais = [
  {
    titulo: 'Infraestrutura completa',
    texto: 'Água tratada, drenagem, pavimentação, rede elétrica e iluminação pública entregues pelo empreendedor.',
    imagem: '/img/dif-energia.webp',
  },
  {
    titulo: 'Segurança',
    texto: 'Portaria, fechamento perimetral e monitoramento para viver com tranquilidade.',
    imagem: '/img/dif-monitoramento.webp',
  },
  {
    titulo: 'Lazer de clube',
    texto: 'Mais de 40 itens de lazer distribuídos entre o lago, as praças e as áreas esportivas.',
    imagem: '/img/dif-lazer.webp',
  },
];

export const assinaturas = [
  {
    nome: 'Takeda Design',
    papel: 'Paisagismo',
    texto: 'Com 39 anos de experiência, especialistas em paisagismo biofílico.',
    logo: '/img/logo-takeda.webp',
  },
  {
    nome: 'All Design · Allan Sávio',
    papel: 'Arquitetura',
    texto: 'Projetar lugares acolhedores, plenos de possibilidades para viver, expressando as qualidades essenciais do lugar.',
    logo: '/img/logo-alldesign.webp',
  },
];

export const galeria = Array.from({ length: 30 }, (_, i) => ({
  src: `/img/galeria/gran-lago-${i + 1}.webp`,
  alt: `Perspectiva ilustrativa do Gran Lago ${i + 1}`,
}));
