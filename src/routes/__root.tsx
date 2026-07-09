import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { CartDrawer } from "@/components/cart/cart-drawer"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartSideButton } from "@/components/cart/cart-side-button"
import { FloatBar } from "@/components/editor/float-bar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useHeaderTheme } from "@/components/site-header/use-header-theme"
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
        title: "Silos Grão",
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
  const theme = useHeaderTheme()

  return (
    <SiteHeader
      theme={theme.desktopTokens}
      whatsappUrl={SITE_WHATSAPP_URL}
    />
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { editor, editorState } = Route.useLoaderData()

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider>
          <RootSiteHeader />
          {children}
          <SiteFooter />
          <CartSideButton />
          <CartDrawer />
          {editor && editorState ? (
            <FloatBar
              editor={{
                id: editor.id,
                email: editor.email,
                tipo: editor.tipo,
              }}
              canUndo={editorState.canUndo}
              canRedo={editorState.canRedo}
              hasDevChanges={editorState.hasDevChanges}
            />
          ) : null}
        </CartProvider>
        <Scripts />
      </body>
    </html>
  )
}
