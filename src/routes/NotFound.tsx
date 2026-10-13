import { Link } from 'react-router'
import { useLocale } from '../i18n/useLocale.ts'

export function NotFound() {
  const { t } = useLocale()

  return (
    <>
      <h1>{t.notFound.title}</h1>
      <Link to="/" className="underline focus-visible:outline-2 focus-visible:outline-offset-2">
        {t.notFound.back}
      </Link>
    </>
  )
}
