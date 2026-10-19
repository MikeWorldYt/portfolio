import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts'

const triggerRatio = 0.6
const themeDelayMs = 1000

// `forced` keeps the water up (Projects, Contact). When it is released the last state is kept until the next
// measurement, which waits a tick so a hash scroll lands first and the page does not flash light then dark.
export function useWaterTheme(sectionId: string, forced = false) {
  const [rising, setRising] = useState(forced)
  const [dark, setDark] = useState(forced)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (forced) {
      setRising(true)
      return
    }

    const update = () => {
      const section = document.getElementById(sectionId)
      setRising(!!section && section.getBoundingClientRect().top <= window.innerHeight * triggerRatio)
    }
    const first = window.setTimeout(update, 0)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.clearTimeout(first)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionId, forced])

  useEffect(() => {
    const timer = setTimeout(() => setDark(rising), reduceMotion || forced ? 0 : themeDelayMs)
    return () => clearTimeout(timer)
  }, [rising, reduceMotion, forced])

  return { rising, theme: dark ? ('dark' as const) : undefined }
}
