import type { ReactNode } from 'react'

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="flex min-h-[70vh] flex-col justify-center py-16 md:py-24">
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </section>
  )
}
