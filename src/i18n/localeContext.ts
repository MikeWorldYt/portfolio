import { createContext } from 'react'
import type { Dictionary, Locale } from './types.ts'

export type LocaleValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

export const LocaleContext = createContext<LocaleValue | null>(null)
