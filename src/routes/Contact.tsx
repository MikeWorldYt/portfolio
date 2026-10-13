import { useLocale } from '../i18n/useLocale.ts'

export function Contact() {
  const { t } = useLocale()
  return <h1>{t.contact.title}</h1>
}
