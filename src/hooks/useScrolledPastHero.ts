import { useEffect, useState } from 'react'

const thresholdRatio = 0.12

export function useScrolledPastHero() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const update = () => setPast(window.scrollY > window.innerHeight * thresholdRatio)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return past
}
