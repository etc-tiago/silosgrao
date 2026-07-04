import { Turnstile } from "@marsidev/react-turnstile"

interface TurnstileWidgetProps {
  siteKey: string
  onSuccess: (token: string) => void
  onExpire?: () => void
}

export function TurnstileWidget({
  siteKey,
  onSuccess,
  onExpire,
}: TurnstileWidgetProps) {
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onExpire={onExpire}
      options={{ theme: "light", size: "normal" }}
    />
  )
}
