import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const scriptSrc = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile)
    const script = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`) ?? document.createElement('script')
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'))))
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')))
    if (!script.parentNode) {
      script.src = scriptSrc
      script.async = true
      document.head.append(script)
    }
  })
}

type Props = { onToken: (token: string) => void }

export function TurnstileWidget({ onToken }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let widgetId: string | undefined
    let cancelled = false

    loadScript()
      .then((turnstile) => {
        if (cancelled || !container.current) return
        widgetId = turnstile.render(container.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        })
      })
      .catch((error) => console.error('Turnstile load failed', error))

    return () => {
      cancelled = true
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [onToken])

  return <div ref={container} />
}
