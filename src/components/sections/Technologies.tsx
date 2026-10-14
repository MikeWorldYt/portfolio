import { technologies } from '../../data/technologies.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'
import { Section } from '../ui/Section.tsx'

export function Technologies() {
  const { t } = useLocale()

  return (
    <Section id="technologies">
      <h2 className="mb-2 text-3xl font-bold">{t.technologies.title}</h2>
      <p className="mb-4">{t.technologies.intro}</p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {technologies.map(({ id, label, abbr }) => (
          <li key={id} className="rounded-xl border border-gray-200 p-3 text-center text-sm">
            <ImagePlaceholder label={label} className="mb-2 aspect-square font-bold">
              {abbr}
            </ImagePlaceholder>
            {label}
          </li>
        ))}
      </ul>
    </Section>
  )
}
