export const HERO_COLUMN_DEFAULTS = [
  "/demo/hero-col-1.jpg",
  "/demo/hero-col-2.jpg",
  "/demo/hero-col-3.jpg",
  "/demo/hero-col-4.jpg",
  "/demo/hero-col-5.jpg",
  "/demo/hero-col-6.jpg",
] as const

export const HERO_COLUMN_PATHS = [1, 2, 3, 4, 5, 6].map(
  (i) => `hero.columns.${i}` as const
)

export const HERO_CATEGORY_PATHS = [1, 2, 3, 4, 5, 6].map(
  (i) => `hero.categories.${i}` as const
)

export type HeroColumnPath = (typeof HERO_COLUMN_PATHS)[number]
export type HeroCategoryPath = (typeof HERO_CATEGORY_PATHS)[number]
