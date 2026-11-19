import { useContext } from 'react'
import { ThemeContext } from '../ui/themeContext.ts'
import { useLocale } from '../../i18n/useLocale.ts'

export function Footer() {
  const { t } = useLocale()
  const theme = useContext(ThemeContext)

  return (
    <footer
      data-fi="hi"
      data-theme={theme}
      className="fx-text border-t border-(color:--bd) px-4 py-6 text-center text-sm"
    >
      © {new Date().getFullYear()} {t.site.name}. {t.footer.rights}.
    </footer>
  )
}
