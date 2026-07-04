import { createFileRoute } from "@tanstack/react-router"
import { getWorkerEnv } from "@/lib/server/env"

export const Route = createFileRoute("/api/content-assets/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const env = getWorkerEnv()
        const bucket = env.CONTENT_ASSETS

        if (!bucket) {
          return new Response("Not Found", { status: 404 })
        }

        const key = params._splat ?? ""
        if (!key.startsWith("content/")) {
          return new Response("Not Found", { status: 404 })
        }

        const object = await bucket.get(key)
        if (!object) {
          return new Response("Not Found", { status: 404 })
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new Response(object.body, { headers })
      },
    },
  },
})
