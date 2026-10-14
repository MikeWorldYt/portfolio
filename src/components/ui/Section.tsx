import type { ReactNode, Ref } from 'react'
import { Fidelity } from './Fidelity.tsx'
import type { FidelityLevel } from './Fidelity.tsx'

type SectionProps = {
  id: string
  level: FidelityLevel
  ref?: Ref<HTMLElement>
  children: ReactNode
}

export function Section({ id, level, ref, children }: SectionProps) {
  return (
    <section ref={ref} id={id} className="flex min-h-[70vh] flex-col justify-center py-16 md:py-24">
      <Fidelity level={level} className="mx-auto w-full max-w-4xl">
        {children}
      </Fidelity>
    </section>
  )
}
