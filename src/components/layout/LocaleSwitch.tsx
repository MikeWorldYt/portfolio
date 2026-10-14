import { useLocale } from '../../i18n/useLocale.ts'

export function LocaleSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()
  const next = locale === 'en' ? 'es' : 'en'

  return (
    <button
      type="button"
      lang={next}
      aria-label={t.localeSwitch.label}
      onClick={() => setLocale(next)}
      className={`fx px-3 py-1.5 text-xs font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {next}
    </button>
  )
}
