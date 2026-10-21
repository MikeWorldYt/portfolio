import { technologies } from '../../data/technologies.ts'
import { useInView } from '../../hooks/useInView.ts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useWaterTheme } from '../../hooks/useWaterTheme.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { GlassTile } from '../ui/LiquidGlass.tsx'
import { Section } from '../ui/Section.tsx'

export function Technologies() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLElement>(0.3)
  const reduceMotion = usePrefersReducedMotion()
  // Turns hi-fi no later than the dark water, so dark tokens never meet mid-fi styles (tall section on mobile).
  const { rising } = useWaterTheme('technologies')

  return (
    <Section id="technologies" compact level={seen || rising || reduceMotion ? 'hi' : 'mid'} ref={ref}>
      <div className="relative">
        <h2 className="scroll-rise mb-2 text-3xl font-bold tracking-tight">{t.technologies.title}</h2>
        <p className="scroll-rise mb-8 opacity-80">{t.technologies.intro}</p>
        <ul className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 md:grid-cols-5 lg:grid-cols-6">
          {technologies.map(({ id, label, icon }, index) => (
            <li key={id} style={{ animationRange: `entry ${(index % 6) * 6}% cover ${18 + (index % 6) * 2}%` }} className="scroll-rise">
              <div className="transition-[filter,opacity] duration-700 in-data-[fi=mid]:opacity-60 in-data-[fi=mid]:grayscale motion-reduce:transition-none">
                <GlassTile icon={icon} label={label} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
