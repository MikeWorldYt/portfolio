import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Icon } from '../ui/Icon.tsx'
import { Section } from '../ui/Section.tsx'

export function ContactCta() {
  const { t } = useLocale()

  return (
    <Section id="contact" level="hi">
      <div className="rounded-2xl bg-indigo-600 px-6 py-12 text-center text-white">
        <h2 className="mb-2 text-3xl font-bold">{t.contactCta.title}</h2>
        <p className="mb-4 opacity-90">{t.contactCta.text}</p>
        <Button to="/contact" variant="light">
          {t.contactCta.cta}
          <Icon icon={faArrowRight} />
        </Button>
      </div>
    </Section>
  )
}
