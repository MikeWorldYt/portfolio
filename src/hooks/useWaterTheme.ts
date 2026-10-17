import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts'

const triggerRatio = 0.6
const themeDelayMs = 500

export function useWaterTheme(sectionId: string) {
  const [rising, setRising] = useState(false)
  const [dark, setDark] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const update = () => {
      const section = document.getElementById(sectionId)
      setRising(!!section && section.getBoundingClientRect().top <= window.innerHeight * triggerRatio)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionId])

  useEffect(() => {
    const timer = setTimeout(() => setDark(rising), reduceMotion ? 0 : themeDelayMs)
    return () => clearTimeout(timer)
  }, [rising, reduceMotion])

  return { rising, theme: dark ? ('dark' as const) : undefined }
}
