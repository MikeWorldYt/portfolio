import { Link, useLocation } from 'react-router'
import { sections } from '../../data/sections.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { scrollToSection } from '../../utils/stepStops.ts'
import { Icon } from '../ui/Icon.tsx'
import type { FidelityLevel } from '../ui/Fidelity.tsx'
import { LocaleSwitch } from './LocaleSwitch.tsx'

export type NavMode = 'side' | 'top'

type NavigationProps = {
  mode: NavMode
  level: FidelityLevel
  theme?: 'dark'
  active: string | null
}

const shape = {
  side: 'md:h-screen md:w-47 md:fx-edge-r',
  top: 'md:h-14 md:w-full md:fx-edge-b',
}

const inner = {
  side: 'md:flex-col md:gap-5 md:px-3 md:py-6',
  top: 'md:flex-row md:items-center md:gap-2 md:px-6 md:py-0',
}

const list = {
  side: 'md:flex-col md:gap-1',
  top: 'md:flex-row md:gap-0.5',
}

const brand = {
  side: 'md:ml-3',
  top: 'md:mr-auto',
}

const language = {
  side: 'md:mt-auto',
  top: 'md:ml-3',
}

export function Navigation({ mode, level, theme, active }: NavigationProps) {
  const { t } = useLocale()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  const scrollTo = (id: string) => (event: React.MouseEvent) => {
    if (!onHome) return
    event.preventDefault()
    scrollToSection(id)
  }

  return (
    <>
      <LocaleSwitch className="fixed top-2 right-2 z-10 md:hidden" />
      <nav
        id={onHome ? 'wf-00-navbar' : undefined}
        data-fg-from="left"
        data-fi={level}
        data-theme={theme}
        aria-label={t.nav.label}
        className={`fx-nav fixed inset-x-0 bottom-0 z-10 fx-edge-t pb-[env(safe-area-inset-bottom)] md:inset-x-auto md:top-0 md:bottom-auto md:left-0 md:overflow-hidden md:pb-0 ${shape[mode]}`}
      >
        <div className={`md:flex md:h-full ${inner[mode]}`}>
          <span className={`hidden font-bold whitespace-nowrap md:block ${brand[mode]}`}>{t.site.name}</span>
          <ul className={`grid grid-cols-6 md:flex ${list[mode]}`}>
            {sections.map(({ id, icon }) => (
              <li key={id}>
                <Link
                  to={{ pathname: '/', hash: `#${id}` }}
                  onClick={scrollTo(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className="flex h-[62px] flex-col items-center justify-center gap-0.5 text-[10.5px] opacity-80 focus-visible:outline-2 focus-visible:-outline-offset-2 aria-[current=true]:bg-(--act) aria-[current=true]:font-bold aria-[current=true]:opacity-100 md:h-[38px] md:flex-row md:justify-start md:gap-2.5 md:px-3 md:text-sm md:rounded-(--r)"
                >
                  <Icon icon={icon} className="text-xl in-data-[fi=lo]:[--fa-display:none] md:text-base" />
                  <span>{t.nav.items[id]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={`hidden md:block ${language[mode]}`}>
            <LocaleSwitch className="w-full" />
          </div>
        </div>
      </nav>
    </>
  )
}
