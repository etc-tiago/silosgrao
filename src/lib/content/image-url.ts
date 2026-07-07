export function isUploadedContentAssetUrl(request: Request, value: string) {
  try {
    const url = new URL(value, request.url)
    const origin = new URL(request.url).origin
    return (
      url.origin === origin && url.pathname.startsWith("/api/content-assets/")
    )
  } catch {
    return false
  }
}

export function isAllowedCatalogImageUrl(request: Request, value: string) {
  if (isUploadedContentAssetUrl(request, value)) return true

  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}
