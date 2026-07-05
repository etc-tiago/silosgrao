import type { EditableFields } from "@/lib/content/fields/types"

export const siteEditableFields = {
  "header.logoPreset": {
    label: "Cor da logo",
    editTipo: "logo-preset",
    contentType: "text",
    pageSlug: "site",
  },
  "header.whatsappUrl": {
    label: "WhatsApp — link",
    editTipo: "text",
    contentType: "text",
    pageSlug: "site",
  },
  "footer.about": {
    label: "Rodapé — sobre",
    editTipo: "text",
    contentType: "text",
    pageSlug: "site",
  },
  "footer.contactTitle": {
    label: "Rodapé — título contato",
    editTipo: "text",
    contentType: "text",
    pageSlug: "site",
  },
  "footer.categoriesTitle": {
    label: "Rodapé — título categorias",
    editTipo: "text",
    contentType: "text",
    pageSlug: "site",
  },
} satisfies EditableFields

export const siteContentPaths = Object.keys(siteEditableFields)

export const SITE_FOOTER_ABOUT_DEFAULT =
  "O armazenamento que sua produção precisa! Soluções completas em silos, secadores, transportadores e infraestrutura metálica para armazenamento de grãos."

export const SITE_FOOTER_CONTACT_TITLE_DEFAULT = "Entre em Contato"
export const SITE_FOOTER_CATEGORIES_TITLE_DEFAULT = "Categorias"
