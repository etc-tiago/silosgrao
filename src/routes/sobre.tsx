import { P, useEditorMode } from "@/components/content"
import { useEditNavigation } from "@/components/content/editor-mode"
import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { mergeSobreEditorFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import {
  parseSobrePrinciples,
  SOBRE_INTRO_P1_DEFAULT,
  SOBRE_INTRO_P1_PATH,
  SOBRE_INTRO_P2_DEFAULT,
  SOBRE_INTRO_P2_PATH,
  SOBRE_MISSION_QUOTE_DEFAULT,
  SOBRE_MISSION_QUOTE_PATH,
  SOBRE_PRINCIPLES_PATH,
  sobreFieldValue,
} from "@/lib/content/fields/sobre"
import { loadSobreContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/sobre")({
  validateSearch: editSearchSchema,
  loader: () => loadSobreContent(),
  head: () => ({
    meta: [{ title: "Sobre · Silos Grão" }],
  }),
  component: SobrePage,
})

function SobrePrinciplesList({
  content,
}: {
  content: Record<string, string>
}) {
  const { isEditor } = useEditorMode()
  const { editPath, openEdit } = useEditNavigation()
  const principles = parseSobrePrinciples(content[SOBRE_PRINCIPLES_PATH])
  const selected = editPath === SOBRE_PRINCIPLES_PATH

  const newLocal = isEditor &&
    "cursor-pointer rounded-sm transition-[box-shadow]"
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-foreground">Princípios</h2>
      <ul
        className={cn(
          "mt-4 list-disc space-y-2 pl-5 text-muted-foreground",
          newLocal,
          isEditor &&
          selected &&
          "outline outline-offset-2 outline-primary/60"
        )}
        data-edit-path={SOBRE_PRINCIPLES_PATH}
        onClick={
          isEditor
            ? () => openEdit(SOBRE_PRINCIPLES_PATH, "text")
            : undefined
        }
        onKeyDown={
          isEditor
            ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                openEdit(SOBRE_PRINCIPLES_PATH, "text")
              }
            }
            : undefined
        }
        role={isEditor ? "button" : undefined}
        tabIndex={isEditor ? 0 : undefined}
      >
        {principles.map((principio, index) => (
          <li key={`${index}-${principio}`}>{principio}</li>
        ))}
      </ul>
    </section>
  )
}

function SobrePage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeSobreEditorFields()

  return (
    <EditorPageProvider
      mode={mode}
      content={content}
      fields={fields}
      search={search}
    >
      <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
        <div className="mx-auto max-w-3xl">
          <ProductBreadcrumb
            items={[
              { kind: "link", label: "Início", to: "/" },
              { kind: "page", label: "Sobre" },
            ]}
            className="mb-8"
          />

          <header className="mb-10">
            <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-5xl")}>
              Sobre Nós
            </h1>
          </header>

          <article className="prose prose-neutral max-w-none dark:prose-invert">
            <P
              path={SOBRE_INTRO_P1_PATH}
              editTipo="text"
              value={sobreFieldValue(
                content,
                SOBRE_INTRO_P1_PATH,
                SOBRE_INTRO_P1_DEFAULT
              )}
              className="leading-relaxed text-muted-foreground"
            />

            <P
              path={SOBRE_INTRO_P2_PATH}
              editTipo="text"
              value={sobreFieldValue(
                content,
                SOBRE_INTRO_P2_PATH,
                SOBRE_INTRO_P2_DEFAULT
              )}
              className="mt-4 leading-relaxed text-muted-foreground"
            />

            <section className="mt-10">
              <h2 className="font-display text-2xl text-foreground">
                Nossa Missão
              </h2>
              <P
                path={SOBRE_MISSION_QUOTE_PATH}
                editTipo="text"
                value={sobreFieldValue(
                  content,
                  SOBRE_MISSION_QUOTE_PATH,
                  SOBRE_MISSION_QUOTE_DEFAULT
                )}
                className="mt-4 border-l-4 border-primary/40 pl-4 text-lg leading-relaxed text-foreground italic"
              />
            </section>

            <SobrePrinciplesList content={content} />
          </article>

          <nav
            aria-label="Documentos institucionais"
            className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-8 text-sm text-muted-foreground/70"
          >
            <Link
              to="/codigo-etica"
              className="transition-colors hover:text-muted-foreground"
            >
              Código de Conduta
            </Link>
            <a
              href="/privacidade.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-muted-foreground"
            >
              Política de Privacidade
            </a>
          </nav>
        </div>
      </main>
    </EditorPageProvider>
  )
}
