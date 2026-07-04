import { useEffect, useState } from "react"

type EditorPageChromeValue = {
  openContentBrowser: () => void
  isContentBrowserOpen: boolean
}

let activeChrome: EditorPageChromeValue | null = null
const listeners = new Set<() => void>()

export function registerEditorPageChrome(value: EditorPageChromeValue | null) {
  activeChrome = value
  for (const listener of listeners) {
    listener()
  }
}

export function useEditorPageChrome() {
  const [, tick] = useState(0)

  useEffect(() => {
    const listener = () => tick((n) => n + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return activeChrome
}
