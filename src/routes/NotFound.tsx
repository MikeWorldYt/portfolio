import { useLocale } from '../i18n/useLocale.ts'

export function NotFound() {
  const { t } = useLocale()
  return <h1>{t.notFound.title}</h1>
}
