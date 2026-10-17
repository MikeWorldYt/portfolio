import { Outlet, useLocation } from 'react-router'
import { sections } from '../../data/sections.ts'
import { useActiveSection } from '../../hooks/useActiveSection.ts'
import { useHashScroll } from '../../hooks/useHashScroll.ts'
import { useScrolledPastHero } from '../../hooks/useScrolledPastHero.ts'
import { useLocale } from '../../i18n/useLocale.ts'
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
  useHashScroll()
  const mode: NavMode = onHome && !pastHero ? 'side' : 'top'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20 focus:bg-white focus:p-2 focus-visible:outline-2"
      >
        {t.nav.skipToContent}
      </a>
      <Navigation mode={mode} level={level} active={active} />
      <div
        className={`flex min-h-screen flex-col pb-[62px] md:pb-0 md:transition-[padding] md:duration-[550ms] motion-reduce:transition-none ${contentOffset[mode]}`}
      >
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-8 focus:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
