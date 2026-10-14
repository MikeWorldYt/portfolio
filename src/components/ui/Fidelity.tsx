import type { CSSProperties, ReactNode } from 'react'

export type FidelityLevel = 'lo' | 'mid' | 'hi'

type FidelityProps = {
  level: FidelityLevel
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Fidelity({ level, className = '', style, children }: FidelityProps) {
  return (
    <div data-fi={level} style={style} className={`fx-text ${className}`}>
      {children}
    </div>
  )
}
