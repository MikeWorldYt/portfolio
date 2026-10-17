import { Outlet, useLocation } from 'react-router'
import { sections } from '../../data/sections.ts'
import { useActiveSection } from '../../hooks/useActiveSection.ts'
import { useHashScroll } from '../../hooks/useHashScroll.ts'
import { useScrolledPastHero } from '../../hooks/useScrolledPastHero.ts'
import { useWaterTheme } from '../../hooks/useWaterTheme.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { ThemeContext } from '../ui/themeContext.ts'
import { Footer } from './Footer.tsx'
import { Navigation } from './Navigation.tsx'
import type { NavMode } from './Navigation.tsx'

const sectionIds = sections.map(({ id }) => id)

const contentOffset = {
  side: 'md:pl-47',
  top: 'md:pt-14',
}

export function Layout() {
  const { t } = useLocale()
  const onHome = useLocation().pathname === '/'
  const pastHero = useScrolledPastHero()
  const { active, level } = useActiveSection(sectionIds, onHome)
  const { rising, theme } = useWaterTheme('technologies')
  useHashScroll()
  const mode: NavMode = onHome && !pastHero ? 'side' : 'top'

  return (
    <ThemeContext.Provider value={theme}>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(60%_22rem_at_50%_0,rgb(99_102_241/0.28),transparent),var(--water)] transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${rising ? '[clip-path:inset(0)]' : '[clip-path:inset(100%_0_0_0)]'}`}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20 focus:bg-white focus:p-2 focus-visible:outline-2"
      >
        {t.nav.skipToContent}
      </a>
      <Navigation mode={mode} level={level} theme={theme} active={active} />
      <div
        className={`flex min-h-screen flex-col pb-[62px] md:pb-0 md:transition-[padding] md:duration-[550ms] motion-reduce:transition-none ${contentOffset[mode]}`}
      >
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-8 focus:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}
