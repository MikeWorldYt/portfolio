import { faUser } from '@fortawesome/free-solid-svg-icons'
import { ContactCta } from '../components/sections/ContactCta.tsx'
import { Hero } from '../components/sections/Hero.tsx'
import { Projects } from '../components/sections/Projects.tsx'
import { Skills } from '../components/sections/Skills.tsx'
import { Social } from '../components/sections/Social.tsx'
import { Technologies } from '../components/sections/Technologies.tsx'
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { useLocale } from '../i18n/useLocale.ts'

export function Home() {
  const { t } = useLocale()

  return (
    <>
      <div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <Hero />
          <Skills />
        </div>
        <aside aria-hidden="true" className="hidden md:block">
          <div className="sticky top-24">
            <ImagePlaceholder label={t.home.imageAlt} className="h-[min(56vh,440px)]">
              <Icon icon={faUser} className="text-7xl" />
            </ImagePlaceholder>
            <small className="mt-2 block text-center opacity-70">{t.home.imageCaption}</small>
          </div>
        </aside>
      </div>
      <Technologies />
      <Projects />
      <Social />
      <ContactCta />
    </>
  )
}
