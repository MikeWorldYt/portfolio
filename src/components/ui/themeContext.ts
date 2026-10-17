import { createContext } from 'react'

export type Theme = 'dark' | undefined

export const ThemeContext = createContext<Theme>(undefined)
