import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { FloatBar } from "@/components/editor/float-bar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { usePageLogoPreset } from "@/components/site-header/use-page-logo-preset"
import { loadRootContent } from "@/lib/content/home.fn"
import { SITE_WHATSAPP_URL } from "@/lib/site/contact"
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
  loader: () => loadRootContent(),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootSiteHeader() {
  const { content } = Route.useLoaderData()
  const logoPreset = usePageLogoPreset(content)
  const whatsappUrl =
    content["header.whatsappUrl"]?.trim() || SITE_WHATSAPP_URL

  return <SiteHeader logoPreset={logoPreset} whatsappUrl={whatsappUrl} />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { editor, editorState, content } = Route.useLoaderData()

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <RootSiteHeader />
        {children}
        <SiteFooter content={content} />
        {editor && editorState ? (
          <FloatBar
            canUndo={editorState.canUndo}
            canRedo={editorState.canRedo}
            hasDevChanges={editorState.hasDevChanges}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
