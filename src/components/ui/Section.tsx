import type { ReactNode, Ref } from 'react'
import { Fidelity } from './Fidelity.tsx'
import type { FidelityLevel } from './Fidelity.tsx'

type SectionProps = {
  id: string
  level: FidelityLevel
  compact?: boolean
  theme?: 'dark'
  ref?: Ref<HTMLElement>
  children: ReactNode
}

export function Section({ id, level, compact, theme, ref, children }: SectionProps) {
  return (
    <section ref={ref} id={id} className={`flex flex-col justify-center ${compact ? 'py-12 md:py-16' : 'min-h-[70vh] py-16 md:py-24'}`}>
      <Fidelity level={level} theme={theme} className="w-full">
        {children}
      </Fidelity>
    </section>
  )
}
