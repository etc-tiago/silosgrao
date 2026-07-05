import { SITE_WHATSAPP_URL } from "@/lib/site/contact"

export type HomeIntentLink =
  | { kind: "route"; to: "/produtos" | "/"; hash?: string }
  | { kind: "external"; href: string }

export type HomeIntent = {
  title: string
  description: string
  img: string
  link: HomeIntentLink
}

export const HOME_INTENT_DEFAULTS = [
  {
    title: "Quero um orçamento",
    description:
      "Solicite uma proposta personalizada para armazenagem, secagem, transporte ou beneficiamento.",
    img: "/demo/stay1.jpg",
    link: {
      kind: "external",
      href: `${SITE_WHATSAPP_URL}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento.")}`,
    },
  },
  {
    title: "Quero peças de reposição",
    description:
      "Encontre componentes originais para equipamentos de movimentação, secagem e armazenagem.",
    img: "/demo/stay2.jpg",
    link: { kind: "route", to: "/produtos" },
  },
  {
    title: "Quero conhecer a empresa",
    description:
      "Conheça nossa história, estrutura e atuação no sudoeste do Paraná desde 2010.",
    img: "/demo/stay3.jpg",
    link: { kind: "route", to: "/", hash: "sobre" },
  },
  {
    title: "Quero ver o catálogo de produtos",
    description:
      "Explore silos, secadores, transportadores e soluções completas para o agronegócio.",
    img: "/demo/stay4.jpg",
    link: { kind: "route", to: "/produtos" },
  },
] as const satisfies readonly HomeIntent[]
