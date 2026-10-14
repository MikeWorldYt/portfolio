import { useLocale } from '../../i18n/useLocale.ts'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t px-4 py-6 text-center text-sm">
      © {new Date().getFullYear()} MikeWorld™. {t.footer.rights}.
    </footer>
  )
}
