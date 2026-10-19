import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToSection } from '../utils/stepStops.ts'

export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    scrollToSection(hash.slice(1))
  }, [pathname, hash])
}
