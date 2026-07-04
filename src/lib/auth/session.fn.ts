import { createServerFn } from "@tanstack/react-start"
import { getServerOrpcClient } from "@/orpc/server-client"

export const loadRootSession = createServerFn({ method: "GET" }).handler(
  async () => {
    return getServerOrpcClient().auth.getSession()
  }
)
