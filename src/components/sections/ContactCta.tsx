import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Icon } from '../ui/Icon.tsx'
import { Section } from '../ui/Section.tsx'

export function ContactCta() {
  const { t } = useLocale()

  return (
    <Section id="contact" level="hi">
      <div className="relative px-6 py-12 text-center text-white">
        {/* Painted below the background shapes so they float over the panel; the content stays on top. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 rounded-2xl bg-indigo-600" />
        <h2 className="mb-2 text-3xl font-bold">{t.contactCta.title}</h2>
        <p className="mb-4 opacity-90">{t.contactCta.text}</p>
        <span className="relative z-1 inline-block">
          <Button to="/contact" variant="light">
            {t.contactCta.cta}
            <Icon icon={faArrowRight} />
          </Button>
        </span>
      </div>
    </Section>
  )
}
