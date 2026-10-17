import { useContext } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ThemeContext } from './themeContext.ts'

export type FidelityLevel = 'lo' | 'mid' | 'hi'

type FidelityProps = {
  level: FidelityLevel
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Fidelity({ level, className = '', style, children }: FidelityProps) {
  const theme = useContext(ThemeContext)

  return (
    <div data-fi={level} data-theme={theme} style={style} className={`fx-text ${className}`}>
      {children}
    </div>
  )
}
