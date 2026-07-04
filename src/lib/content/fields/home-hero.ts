export const HERO_COLUMN_DEFAULTS = [
  "/demo/hero-col-1.jpg",
  "/demo/hero-col-2.jpg",
  "/demo/hero-col-3.jpg",
  "/demo/hero-col-4.jpg",
  "/demo/hero-col-5.jpg",
] as const

export const HERO_CATEGORY_DEFAULTS = [
  "Armazenagem",
  "Linha fazenda",
  "Linha Razão",
  "Secagem",
  "Transporte",
] as const

export const HERO_HEADLINE_DEFAULTS = {
  line1: "A Unique Space",
  line2: "Surrounded By Nature",
} as const

export const HERO_INTRO_DEFAULT =
  "Fundada em 2010, a Silos Graos é uma empresa brasileira e líder na região sudoeste do Paraná em soluções completas para beneficiamento, conservação, armazenamento e movimentação de sementes, grãos, biocombustíveis, rações e alimentos."

export const HERO_COLUMN_PATHS = [1, 2, 3, 4, 5].map(
  (i) => `hero.columns.${i}` as const
)

export const HERO_CATEGORY_PATHS = [1, 2, 3, 4, 5].map(
  (i) => `hero.categories.${i}` as const
)

export type HeroColumnPath = (typeof HERO_COLUMN_PATHS)[number]
export type HeroCategoryPath = (typeof HERO_CATEGORY_PATHS)[number]
