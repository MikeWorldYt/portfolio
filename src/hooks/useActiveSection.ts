import { useEffect, useState } from 'react'
import type { FidelityLevel } from '../components/ui/Fidelity.tsx'

type ActiveSection = { active: string | null; level: FidelityLevel }

const fallback: ActiveSection = { active: null, level: 'hi' }
const topBarHeight = 56
const tabBarHeight = 62

function toLevel(value: string | undefined): FidelityLevel {
  return value === 'lo' || value === 'mid' ? value : 'hi'
}

export function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [state, setState] = useState<ActiveSection>(fallback)

  useEffect(() => {
    if (!enabled) {
      setState(fallback)
      return
    }

    const update = () => {
      const probe = window.scrollY + window.innerHeight * 0.4
      let current = ids[0]
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top + window.scrollY <= probe) current = id
      }

      const desktop = window.matchMedia('(min-width: 768px)').matches
      const barY = desktop ? topBarHeight / 2 : window.innerHeight - tabBarHeight / 2
      let underBar = ids[0]
      for (const id of ids) {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        if (rect && rect.top <= barY && rect.bottom >= barY) underBar = id
      }
      const fidelity = document.querySelector<HTMLElement>(`#${underBar} > [data-fi]`)
      const level = toLevel(fidelity?.dataset.fi)

      setState((prev) => (prev.active === current && prev.level === level ? prev : { active: current, level }))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const main = document.getElementById('main')
    const observer = new MutationObserver(update)
    if (main) observer.observe(main, { subtree: true, attributes: true, attributeFilter: ['data-fi'] })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [ids, enabled])

  return state
}
