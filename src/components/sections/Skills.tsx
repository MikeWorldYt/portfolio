import { skills } from '../../data/skills.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Section } from '../ui/Section.tsx'

export function Skills() {
  const { t } = useLocale()

  return (
    <Section id="skills">
      <h2 className="mb-2 text-3xl font-bold">{t.skills.title}</h2>
      <p className="mb-4">{t.skills.intro}</p>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="rounded-full border border-gray-300 px-4 py-2">
            {t.skills.items[skill]}
          </li>
        ))}
      </ul>
    </Section>
  )
}
