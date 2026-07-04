export type HomeIntent = {
  title: string
  description: string
  img: string
}

export const HOME_INTENT_DEFAULTS = [
  {
    title: "Quero um orçamento",
    description:
      "Solicite uma proposta personalizada para armazenagem, secagem, transporte ou beneficiamento.",
    img: "/demo/stay1.jpg",
  },
  {
    title: "Quero peças de reposição",
    description:
      "Encontre componentes originais para equipamentos de movimentação, secagem e armazenagem.",
    img: "/demo/stay2.jpg",
  },
  {
    title: "Quero conhecer a empresa",
    description:
      "Conheça nossa história, estrutura e atuação no sudoeste do Paraná desde 2010.",
    img: "/demo/stay3.jpg",
  },
  {
    title: "Quero ver o catálogo de produtos",
    description:
      "Explore silos, secadores, transportadores e soluções completas para o agronegócio.",
    img: "/demo/stay4.jpg",
  },
] as const satisfies readonly HomeIntent[]
