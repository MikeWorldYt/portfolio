import { LocaleSwitch } from '../components/layout/LocaleSwitch.tsx'
import { useLocale } from '../i18n/useLocale.ts'

export function Home() {
  const { t } = useLocale()
  return (
    <>
      <LocaleSwitch />
      <h1>{t.home.title}</h1>
    </>
  )
}
