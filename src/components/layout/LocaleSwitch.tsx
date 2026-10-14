import { useLocale } from '../../i18n/useLocale.ts'

export function LocaleSwitch() {
  const { locale, setLocale, t } = useLocale()
  const next = locale === 'en' ? 'es' : 'en'

  return (
    <button
      type="button"
      lang={next}
      aria-label={t.localeSwitch.label}
      onClick={() => setLocale(next)}
      className="rounded border px-2 py-1 text-sm font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {next}
    </button>
  )
}
