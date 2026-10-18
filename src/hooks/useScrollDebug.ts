import { useEffect } from 'react'

// Dev-only: logs scroll position as % of viewport (the unit all fidelity thresholds use) and % of page.
export function useScrollDebug() {
  useEffect(() => {
    if (!import.meta.env.DEV) return

    let last = -1
    const log = () => {
      const viewport = Math.round((window.scrollY / window.innerHeight) * 100)
      if (viewport === last) return
      last = viewport
      const max = document.documentElement.scrollHeight - window.innerHeight
      const page = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
      console.log(`[scroll] ${viewport}% viewport · ${page}% page · ${Math.round(window.scrollY)}px`)
    }
    window.addEventListener('scroll', log, { passive: true })
    return () => window.removeEventListener('scroll', log)
  }, [])
}
