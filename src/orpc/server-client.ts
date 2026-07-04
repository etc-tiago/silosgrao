import type { RouterClient } from "@orpc/server"
import { createRouterClient } from "@orpc/server"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { createContext } from "@/orpc/context"
import type { AppRouter } from "@/orpc/router"
import { router } from "@/orpc/router"

export function getServerOrpcClient(): RouterClient<AppRouter> {
  return createRouterClient(router, {
    context: async () => {
      const headers = getRequestHeaders()
      const headerEntries = Object.entries(headers).flatMap(
        ([key, value]): [string, string][] =>
          value === undefined
            ? []
            : [[key, Array.isArray(value) ? value.join(", ") : String(value)]]
      )

      const request = new Request("http://localhost/api/rpc", {
        headers: new Headers(headerEntries),
      })

      return createContext(request)
    },
  })
}
