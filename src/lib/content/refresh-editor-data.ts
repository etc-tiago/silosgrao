import type { RegisteredRouter } from "@tanstack/react-router"

export async function refreshEditorData(router: RegisteredRouter) {
  await router.invalidate({
    filter: (match) =>
      match.routeId === "/" ||
      match.routeId === "/demo" ||
      match.routeId === "__root__",
  })
}
