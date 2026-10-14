import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView.ts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'

type RevealProps = {
  delay?: number
  className?: string
  children: ReactNode
}

export function Reveal({ delay = 0, className = '', children }: RevealProps) {
  const [ref, seen] = useInView<HTMLDivElement>(0.35)
  const reduceMotion = usePrefersReducedMotion()
  const shown = seen || reduceMotion

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-600 ${shown ? '' : 'translate-y-4 opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
