import type { Locale } from './types.ts'

const storageKey = 'locale'

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'es'
}

export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(storageKey)
    if (isLocale(stored)) return stored
  } catch (error) {
    console.warn('Locale storage unavailable', error)
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function storeLocale(locale: Locale) {
  try {
    localStorage.setItem(storageKey, locale)
  } catch (error) {
    console.warn('Locale storage unavailable', error)
  }
}
