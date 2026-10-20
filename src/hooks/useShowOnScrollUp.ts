import { useEffect, useState } from 'react'

const topZonePx = 80
const minDeltaPx = 8

// True near the top of the page or while scrolling up; floating controls get out of the way on the way down.
export function useShowOnScrollUp() {
  const [shown, setShown] = useState(true)

  useEffect(() => {
    let last = window.scrollY
    const update = () => {
      const y = window.scrollY
      if (y < topZonePx) setShown(true)
      else if (Math.abs(y - last) >= minDeltaPx) setShown(y < last)
      else return
      last = y
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return shown
}
