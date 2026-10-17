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
    <Section id="technologies" compact level={seen || reduceMotion ? 'hi' : 'mid'} ref={ref}>
      <div className="relative">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">{t.technologies.title}</h2>
        <p className="mb-8 opacity-80">{t.technologies.intro}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {technologies.map(({ id, label, icon }, index) => (
            <li key={id}>
              <Reveal delay={index * 45}>
                <div className="group flex flex-col items-center gap-3 text-center text-sm">
                  <span className="grid size-16 place-items-center rounded-2xl border border-(color:--chip-bd) bg-(--chip) shadow-(--chip-sh) backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-700 group-hover:-translate-y-1 motion-reduce:transition-none sm:size-[4.5rem]">
                    <img
                      src={icon}
                      alt=""
                      className="size-9 object-contain transition-[filter,opacity] duration-700 in-data-[fi=mid]:opacity-60 in-data-[fi=mid]:grayscale motion-reduce:transition-none sm:size-10"
                    />
                  </span>
                  <span className="opacity-90">{label}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
