import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { HomeHeroIntro } from "@/components/home/home-hero-intro"
import { HomeHeroSection } from "@/components/home/home-hero-section"
import { HomeIntentsSection } from "@/components/home/home-intents-section"
import { mergeEditableFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import { loadHomeContent } from "@/lib/content/home.fn"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo")({
  validateSearch: editSearchSchema,
  loader: () => loadHomeContent(),
  component: DemoPage,
  head: () => ({
    meta: [{ title: "Demo · STAY·SPOT" }],
  }),
})

function DemoPage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeEditableFields("home", "site")

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
        <HomeIntentsSection content={content} framed />
      </main>
    </EditorPageProvider>
  )
}
