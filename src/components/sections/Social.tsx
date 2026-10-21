import { socialProfiles } from '../../data/social.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Icon } from '../ui/Icon.tsx'
import { Section } from '../ui/Section.tsx'

export function Social() {
  const { t } = useLocale()

  return (
    <Section id="social" level="hi">
      <h2 className="scroll-rise mb-2 text-3xl font-bold">{t.social.title}</h2>
      <p className="scroll-rise mb-4">{t.social.intro}</p>
      <ul className="flex flex-wrap gap-3">
        {socialProfiles.map(({ id, label, url, icon }, index) => (
          <li key={id} style={{ animationRange: `entry ${index * 5}% cover ${18 + index}%` }} className="scroll-rise">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="fx inline-flex items-center gap-2 px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Icon icon={icon} />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
