import { useContext } from 'react'
import { LocaleContext } from './localeContext.ts'

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside LocaleProvider')
  return value
}
