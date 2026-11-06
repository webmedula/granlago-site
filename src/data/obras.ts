// Andamento das obras. Atualize "percentual" (0 a 100) e "atualizadoEm".
// percentual: null mostra só o prazo, sem barra de progresso.

export const atualizadoEm = 'CONFIRMAR'; // ex.: 'novembro de 2026'

export type ItemObra = { nome: string; prazo: string; percentual: number | null };
export type EtapaObra = { etapa: string; itens: ItemObra[] };

export const obras: EtapaObra[] = [
  {
    etapa: 'Serviços preliminares',
    itens: [
      { nome: 'Abertura de ruas', prazo: 'mar/2024', percentual: null },
      { nome: 'Marcação dos lotes', prazo: 'mar/2024', percentual: null },
      { nome: 'Limpeza do terreno', prazo: 'mar/2024', percentual: null },
    ],
  },
  {
    etapa: 'Infraestrutura',
    itens: [
      { nome: 'Abastecimento de água tratada', prazo: 'dez/2026', percentual: null },
      { nome: 'Drenagem pluvial e galerias', prazo: 'jun/2027', percentual: null },
      { nome: 'Terraplanagem, pavimentação e meio-fio', prazo: 'jun/2027', percentual: null },
      { nome: 'Rede elétrica e iluminação pública', prazo: 'jun/2027', percentual: null },
    ],
  },
  {
    etapa: 'Obra civil',
    itens: [
      { nome: 'Portaria', prazo: 'jun/2027', percentual: null },
      { nome: 'Edificações de apoio administrativo', prazo: 'jun/2027', percentual: null },
      { nome: 'Fechamento perimetral', prazo: 'jun/2027', percentual: null },
      { nome: 'Espaço gourmet', prazo: 'jun/2027', percentual: null },
      { nome: 'Banheiros', prazo: 'jun/2027', percentual: null },
      { nome: 'Academia', prazo: 'dez/2027', percentual: null },
      { nome: 'Arquibancadas', prazo: 'dez/2027', percentual: null },
      { nome: 'BBQ, beer e wine lounges', prazo: 'dez/2027', percentual: null },
    ],
  },
  {
    etapa: 'Complementares',
    itens: [
      { nome: 'Lago', prazo: 'mar/2025', percentual: null },
      { nome: 'Irrigação e paisagismo', prazo: 'dez/2027', percentual: null },
      { nome: 'Quadras esportivas e pump track', prazo: 'dez/2027', percentual: null },
      { nome: 'Playgrounds', prazo: 'dez/2027', percentual: null },
      { nome: 'Sinalização horizontal e vertical', prazo: 'dez/2027', percentual: null },
    ],
  },
  {
    etapa: 'Extramuros',
    itens: [
      { nome: 'Mall', prazo: 'dez/2027', percentual: null },
      { nome: 'Retorno na Av. Padre Pelágio', prazo: 'dez/2027', percentual: null },
      { nome: 'Ciclovia de acesso', prazo: 'dez/2027', percentual: null },
    ],
  },
];
