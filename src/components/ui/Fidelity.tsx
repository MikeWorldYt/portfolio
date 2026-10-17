import type { CSSProperties, ReactNode } from 'react'

export type FidelityLevel = 'lo' | 'mid' | 'hi'

type FidelityProps = {
  level: FidelityLevel
  theme?: 'dark'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Fidelity({ level, theme, className = '', style, children }: FidelityProps) {
  return (
    <div data-fi={level} data-theme={theme} style={style} className={`fx-text ${className}`}>
      {children}
    </div>
  )
}
