import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { FloatBar } from "@/components/editor/float-bar"
import { SiteHeader } from "@/components/site-header"
import { loadRootSession } from "@/lib/auth/session.fn"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Silos Grãos",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  loader: () => loadRootSession(),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const session = Route.useLoaderData()

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteHeader />
        {children}
        {session.editor && session.editorState ? (
          <FloatBar
            canUndo={session.editorState.canUndo}
            canRedo={session.editorState.canRedo}
            hasDevChanges={session.editorState.hasDevChanges}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
