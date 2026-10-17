import { technologies } from '../../data/technologies.ts'
import { useInView } from '../../hooks/useInView.ts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'
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
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {technologies.map(({ id, label, icon }, index) => (
          <li key={id}>
            <Reveal delay={index * 90}>
              <div className="fx p-3 text-center text-sm">
                <ImagePlaceholder label={label} className="mb-2 aspect-square">
                  <img src={icon} alt="" className="size-12 object-contain sm:size-14" />
                </ImagePlaceholder>
                {label}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
