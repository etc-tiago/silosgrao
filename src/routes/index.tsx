import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { HomeHeroIntro } from "@/components/home/home-hero-intro"
import { HomeHeroSection } from "@/components/home/home-hero-section"
import { HomeIntentsSection } from "@/components/home/home-intents-section"
import { HomeProductGallery } from "@/components/home/home-product-gallery"
import { HomeProductsSection } from "@/components/home/home-products-section"
import { mergeHomeEditorFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import { loadHomeContent } from "@/lib/content/home.fn"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  validateSearch: editSearchSchema,
  loader: () => loadHomeContent(),
  component: HomePage,
})

function HomePage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeHomeEditorFields()

  return (
    <EditorPageProvider
      mode={mode}
      content={content}
      fields={fields}
      search={search}
    >
      <main className="min-h-screen bg-background">
        <HomeHeroSection content={content} />
        <HomeHeroIntro content={content} framed />
        <HomeProductsSection content={content} framed />
        <HomeIntentsSection content={content} framed />
        <HomeProductGallery content={content} framed />
      </main>
    </EditorPageProvider>
  )
}
