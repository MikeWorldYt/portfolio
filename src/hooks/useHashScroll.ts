import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToSection } from '../utils/stepStops.ts'

export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Other pages open at the top; Home without a hash is placed by the intro (lo-fi top or the mid-fi stop).
    if (!hash) {
      if (pathname !== '/') window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    // Arriving from another route lands instantly, so the page never replays the scroll-driven transitions.
    scrollToSection(hash.slice(1), 'instant')
  }, [pathname, hash])
}
