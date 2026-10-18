import { Outlet, useLocation } from 'react-router'
import { sections } from '../../data/sections.ts'
import { useActiveSection } from '../../hooks/useActiveSection.ts'
import { useHashScroll } from '../../hooks/useHashScroll.ts'
import { useScrollDebug } from '../../hooks/useScrollDebug.ts'
import { useScrolledPastHero } from '../../hooks/useScrolledPastHero.ts'
import { useStepScroll } from '../../hooks/useStepScroll.ts'
import { useWaterTheme } from '../../hooks/useWaterTheme.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { ThemeContext } from '../ui/themeContext.ts'
import { FloatingShapes } from '../ui/FloatingShapes.tsx'
import { LiquidGlassFilter } from '../ui/LiquidGlass.tsx'
import { StarField } from '../ui/StarField.tsx'
import { Footer } from './Footer.tsx'
import { Navigation } from './Navigation.tsx'
import { StepNav } from './StepNav.tsx'
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
  useStepScroll(onHome)
  useScrollDebug()
  const mode: NavMode = onHome && !pastHero ? 'side' : 'top'

  return (
    <ThemeContext.Provider value={theme}>
      <LiquidGlassFilter />
      {/* Three depths: water and stars at the back, section panels (z -20) above them, shapes above the panels. */}
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 -z-30 [background:radial-gradient(60%_22rem_at_50%_0,rgb(99_102_241/0.28),transparent),var(--water)] transition-[clip-path] duration-[3000ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${rising ? '[clip-path:circle(200%_at_50%_140%)]' : '[clip-path:circle(0%_at_50%_140%)]'}`}>
        <span className="absolute -top-24 -left-24 size-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <span className="absolute top-1/3 -right-32 size-[28rem] rounded-full bg-violet-500/20 blur-3xl" />
        <span className="absolute -bottom-32 left-1/3 size-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <StarField />
      </div>
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 -z-10 transition-[clip-path] duration-[3000ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${rising ? '[clip-path:circle(200%_at_50%_140%)]' : '[clip-path:circle(0%_at_50%_140%)]'}`}>
        <FloatingShapes active={rising} />
      </div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20 focus:bg-white focus:p-2 focus-visible:outline-2"
      >
        {t.nav.skipToContent}
      </a>
      <Navigation mode={mode} level={level} theme={theme} active={active} />
      {onHome && <StepNav ids={sectionIds} />}
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
