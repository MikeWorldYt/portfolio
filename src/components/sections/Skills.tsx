import { skills } from '../../data/skills.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Section } from '../ui/Section.tsx'

export function Skills() {
  const { t } = useLocale()

  return (
    <Section id="skills" level="mid">
      <h2 className="scroll-rise mb-2 text-3xl font-bold">{t.skills.title}</h2>
      <p className="scroll-rise mb-4">{t.skills.intro}</p>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          // A small per-chip offset in the range staggers chips that share a row.
          <li
            key={skill}
            style={{ animationRange: `entry ${index * 3}% cover ${30 + index * 3}%` }}
            className="fx scroll-rise rounded-full px-4 py-2"
          >
            {t.skills.items[skill]}
          </li>
        ))}
      </ul>
    </Section>
  )
}
