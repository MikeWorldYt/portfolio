import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToSection } from '../utils/stepStops.ts'

export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    // Arriving from another route lands instantly, so the page never replays the scroll-driven transitions.
    scrollToSection(hash.slice(1), 'instant')
  }, [pathname, hash])
}
