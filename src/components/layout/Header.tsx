import { NavLink } from 'react-router'
import { useLocale } from '../../i18n/useLocale.ts'
import { LocaleSwitch } from './LocaleSwitch.tsx'

const linkClass =
  'rounded px-2 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:underline'

export function Header() {
  const { t } = useLocale()

  return (
    <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
      <span className="font-semibold">{t.site.name}</span>
      <nav aria-label={t.nav.label} className="flex items-center gap-2">
        <NavLink to="/" end className={linkClass}>
          {t.nav.home}
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          {t.nav.contact}
        </NavLink>
        <LocaleSwitch />
      </nav>
    </header>
  )
}
