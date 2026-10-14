import { ContactForm } from '../components/contact/ContactForm.tsx'
import { Fidelity } from '../components/ui/Fidelity.tsx'
import { useLocale } from '../i18n/useLocale.ts'

export function Contact() {
  const { t } = useLocale()

  return (
    <Fidelity level="hi" className="mx-auto max-w-xl py-8">
      <h1 className="mb-2 text-4xl font-bold">{t.contact.title}</h1>
      <p className="mb-6">{t.contact.intro}</p>
      <ContactForm />
    </Fidelity>
  )
}
