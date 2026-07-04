import { HeadContent, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router"

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
      {
        name: "apple-mobile-web-app-title",
        content: "Silos Grão",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/icones/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icones/favicon.svg",
      },
      {
        rel: "shortcut icon",
        href: "/icones/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/icones/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/icones/site.webmanifest",
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showSiteHeader = pathname !== "/demo"

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {showSiteHeader ? <SiteHeader /> : null}
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
