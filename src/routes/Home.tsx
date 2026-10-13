import { useLocale } from '../i18n/useLocale.ts'

export function Home() {
  const { t } = useLocale()
  return <h1>{t.home.title}</h1>
}
