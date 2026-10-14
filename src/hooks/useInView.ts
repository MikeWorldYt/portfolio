import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(threshold: number) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || seen) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true)
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [seen, threshold])

  return [ref, seen] as const
}
