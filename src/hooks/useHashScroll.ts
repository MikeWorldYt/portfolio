import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [pathname, hash])
}
