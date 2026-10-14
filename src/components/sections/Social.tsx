import { socialProfiles } from '../../data/social.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Icon } from '../ui/Icon.tsx'
import { Section } from '../ui/Section.tsx'

export function Social() {
  const { t } = useLocale()

  return (
    <Section id="social">
      <h2 className="mb-2 text-3xl font-bold">{t.social.title}</h2>
      <p className="mb-4">{t.social.intro}</p>
      <ul className="flex flex-wrap gap-3">
        {socialProfiles.map(({ id, label, url, icon }) => (
          <li key={id}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-2"
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
