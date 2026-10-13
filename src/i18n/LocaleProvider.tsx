import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { detectLocale, storeLocale } from './detectLocale.ts'
import { LocaleContext } from './localeContext.ts'
import type { Dictionary, Locale } from './types.ts'
import { en } from './locales/en.ts'
import { es } from './locales/es.ts'

const dictionaries: Record<Locale, Dictionary> = { en, es }

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    storeLocale(locale)
  }, [locale])

  const value = useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
