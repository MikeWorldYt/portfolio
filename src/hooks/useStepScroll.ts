import { useEffect } from 'react'
import { contentSelector, wasPointerClaimed } from '../utils/pointerClaim.ts'
import { heroStop, scrollToStop } from '../utils/stepStops.ts'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts'

// While the hero is still a wireframe, a click or tap on bare background plays its first change.
export function useStepScroll(enabled: boolean) {
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || wasPointerClaimed()) return
      if ((event.target as Element | null)?.closest(contentSelector)) return
      if (window.getSelection()?.toString()) return
      const target = heroStop()
      if (window.scrollY < target - 8) scrollToStop(target, reduceMotion)
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [enabled, reduceMotion])
}
