import { z } from "zod"
import { contentTypeEnum, environmentEnum } from "@/db/schema"

export const SITE_DATA_VERSION = 1

export const siteDataPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
})

export const siteDataContentEntrySchema = z.object({
  pageSlug: z.string().min(1),
  path: z.string().min(1),
  type: z.enum(contentTypeEnum),
  value: z.string(),
  environment: z.enum(environmentEnum),
})

export const siteDataCategorySchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  sortOrder: z.number().int().min(0),
})

export const siteDataProductImageSchema = z.object({
  imageUrl: z.string().min(1),
  sortOrder: z.number().int().min(0),
})

export const siteDataProductSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  priceCents: z.number().int().min(0),
  description: z.string().nullable(),
  capacity: z.string().nullable(),
  specs: z.array(z.string()),
  imageUrl: z.string().min(1),
  categorySlug: z.string().nullable(),
  sortOrder: z.number().int().min(0),
  showOnHomepage: z.boolean(),
  gallery: z.array(siteDataProductImageSchema),
})

export const siteDataBundleSchema = z.object({
  version: z.literal(SITE_DATA_VERSION),
  exportedAt: z.string().datetime(),
  pages: z.array(siteDataPageSchema),
  contentEntries: z.array(siteDataContentEntrySchema),
  catalogCategories: z.array(siteDataCategorySchema),
  catalogProducts: z.array(siteDataProductSchema),
})

export type SiteDataBundle = z.infer<typeof siteDataBundleSchema>
