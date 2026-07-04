import { SITE_WHATSAPP_PHONE } from "@/lib/site/contact"

export type ProductCategoryId =
  | "silos"
  | "secadores"
  | "transportadores"
  | "infraestrutura"

export type Product = {
  id: number
  name: string
  capacity: string
  description: string
  specs: string[]
  image: string
}

export const PRODUCT_CATEGORY_TITLES: Record<ProductCategoryId, string> = {
  silos: "Silos de Armazenamento",
  secadores: "Secadores",
  transportadores: "Transportadores",
  infraestrutura: "Infraestrutura Metálica",
}

export const PRODUCT_CATEGORIES = [
  { id: "silos", label: PRODUCT_CATEGORY_TITLES.silos },
  { id: "secadores", label: PRODUCT_CATEGORY_TITLES.secadores },
  { id: "transportadores", label: PRODUCT_CATEGORY_TITLES.transportadores },
  { id: "infraestrutura", label: PRODUCT_CATEGORY_TITLES.infraestrutura },
] as const satisfies ReadonlyArray<{
  id: ProductCategoryId
  label: string
}>

export const HOME_PRODUCTS: Record<ProductCategoryId, Product[]> = {
  silos: [
    {
      id: 1,
      name: "Silo Pequeno",
      capacity: "50 toneladas",
      description: "Ideal para pequenas propriedades e fazendas familiares",
      specs: [
        "Diâmetro: 3,5m",
        "Altura: 8m",
        "Material: Chapa galvanizada",
        "Estrutura: Metálica reforçada",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-50%202-YD6TDONX0JaPTY91buBkMXn7SeGMvl.jpg",
    },
    {
      id: 2,
      name: "Silo Médio",
      capacity: "150 toneladas",
      description: "Perfeito para propriedades médias com produção regular",
      specs: [
        "Diâmetro: 5m",
        "Altura: 12m",
        "Material: Chapa galvanizada premium",
        "Estrutura: Sistema de suporte reforçado",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%202-I6gTLjbHgz46DFOg9LglSdNaboEAF4.jpg",
    },
    {
      id: 3,
      name: "Silo Grande",
      capacity: "300+ toneladas",
      description: "Solução completa para grandes operações e produtores",
      specs: [
        "Diâmetro: 6,5m",
        "Altura: 16m",
        "Material: Chapa galvanizada de alta resistência",
        "Estrutura: Projeto customizado",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%205-4Yi4d020Qf3VuOvVwmRiQoleY4vg7K.jpg",
    },
  ],
  secadores: [
    {
      id: 1,
      name: "Secador Rápido",
      capacity: "5 ton/hora",
      description: "Secagem rápida e eficiente com consumo otimizado de energia",
      specs: [
        "Temperatura: até 80°C",
        "Umidade final: 12-14%",
        "Queimador: Automático",
        "Capacidade: 5 ton/hora",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%205-zwHmJKuVoXRAQbByjRIeecEGn7vS11.jpg",
    },
    {
      id: 2,
      name: "Secador Premium",
      capacity: "10 ton/hora",
      description: "Sistema avançado com controle automático de temperatura",
      specs: [
        "Temperatura: até 90°C",
        "Umidade final: 10-12%",
        "Queimador: Combustão controlada",
        "Capacidade: 10 ton/hora",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-53%204-JLwKv2DLbpVJrCSK7l7IQeMwLdDYjh.jpg",
    },
  ],
  transportadores: [
    {
      id: 1,
      name: "Transportador Pneumático",
      capacity: "20 ton/hora",
      description: "Transporte de grãos com mínimo de danos e contaminação",
      specs: [
        "Vazão: 20 ton/hora",
        "Alcance: até 50m",
        "Pressão: 0,8 a 1,2 bar",
        "Aplicação: Grãos em geral",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52-QLGAnaOFNLyra2U08fUxaahwltbqba.jpg",
    },
    {
      id: 2,
      name: "Transportador de Rosca",
      capacity: "30 ton/hora",
      description: "Transporte contínuo com estrutura robusta e durável",
      specs: [
        "Vazão: 30 ton/hora",
        "Comprimento: até 60m",
        "Material: Aço carbono",
        "Aplicação: Todos os tipos de grãos",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-48-l5zdMTZGkINiN6KfyFb8crSwLqTPPv.jpg",
    },
  ],
  infraestrutura: [
    {
      id: 1,
      name: "Estrutura Padrão",
      capacity: "Modular",
      description: "Suporte estrutural metálico para silos e equipamentos",
      specs: [
        "Tipo: Perfilado metálico",
        "Acabamento: Galvanizado",
        "Capacidade: Até 100 ton",
        "Customizável: Sim",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%204-jDMhsrppVAlVevleSoUgYdR0xIfwzD.jpg",
    },
    {
      id: 2,
      name: "Sistema Integrado",
      capacity: "Completo",
      description: "Solução completa com estrutura, passarelas e plataformas",
      specs: [
        "Tipo: Projeto customizado",
        "Acabamento: Galvanização a fogo",
        "Capacidade: Até 500 ton",
        "Inclui: Escadas, guarda-corpos e plataformas",
      ],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-53%203-gRR5d28i03A6yHHX9Jw4Rs53oBlkiO.jpg",
    },
  ],
}

export function whatsappProductUrl(productName: string) {
  const text = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre o ${productName}`
  )
  return `https://wa.me/${SITE_WHATSAPP_PHONE}?text=${text}`
}

export function whatsappCustomUrl() {
  const text = encodeURIComponent(
    "Olá! Gostaria de uma solução customizada"
  )
  return `https://wa.me/${SITE_WHATSAPP_PHONE}?text=${text}`
}