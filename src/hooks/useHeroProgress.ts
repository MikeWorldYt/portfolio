import { useEffect, useState } from 'react'

const startRatio = 0.12
const spanRatio = 0.21

export function useHeroProgress(enabled: boolean) {
  const [level, setLevel] = useState<'lo' | 'mid'>(enabled ? 'lo' : 'mid')
  const [progress, setProgress] = useState(enabled ? 0 : 1)

  useEffect(() => {
    const root = document.documentElement

    if (!enabled) {
      root.style.setProperty('--t', '1')
      setLevel('mid')
      setProgress(1)
      return () => root.style.removeProperty('--t')
    }

    const update = () => {
      const height = window.innerHeight
      const t = Math.min(1, Math.max(0, (window.scrollY - height * startRatio) / (height * spanRatio)))
      root.style.setProperty('--t', String(t))
      setProgress(t)
      setLevel(window.scrollY > height * startRatio ? 'mid' : 'lo')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      root.style.removeProperty('--t')
    }
  }, [enabled])

  return { level, progress }
}
