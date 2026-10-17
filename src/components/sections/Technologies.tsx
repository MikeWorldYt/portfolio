import { technologies } from '../../data/technologies.ts'
import { useInView } from '../../hooks/useInView.ts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Reveal } from '../ui/Reveal.tsx'
import { Section } from '../ui/Section.tsx'

export function Technologies() {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLElement>(0.3)
  const reduceMotion = usePrefersReducedMotion()

  return (
    <Section id="technologies" level={seen || reduceMotion ? 'hi' : 'mid'} ref={ref}>
      <h2 className="mb-2 text-3xl font-bold">{t.technologies.title}</h2>
      <p className="mb-4">{t.technologies.intro}</p>
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {technologies.map(({ id, label, icon }, index) => (
          <li key={id}>
            <Reveal delay={index * 90}>
              <div className="flex flex-col items-center gap-2 text-center text-sm">
                <img
                  src={icon}
                  alt=""
                  className="size-12 object-contain transition-[filter,opacity] duration-700 in-data-[fi=mid]:opacity-60 in-data-[fi=mid]:grayscale motion-reduce:transition-none sm:size-14"
                />
                {label}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
