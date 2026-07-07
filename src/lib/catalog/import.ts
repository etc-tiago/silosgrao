export { parseImportRow, bulkUpsertProducts } from "@/lib/catalog/service"
export type { CatalogImportRow } from "@/lib/catalog/types"

/**
 * Importação em massa via CSV (formato previsto):
 * slug,title,price,category_slug,description,image_url,gallery_urls
 *
 * gallery_urls: URLs separadas por pipe (|)
 * price: valor em reais (ex: 1234.56) ou centavos inteiros
 */
