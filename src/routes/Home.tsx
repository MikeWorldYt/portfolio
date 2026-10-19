import { faUser } from '@fortawesome/free-solid-svg-icons'
import { ContactCta } from '../components/sections/ContactCta.tsx'
import { Hero } from '../components/sections/Hero.tsx'
import { Projects } from '../components/sections/Projects.tsx'
import { Skills } from '../components/sections/Skills.tsx'
import { Social } from '../components/sections/Social.tsx'
import { Technologies } from '../components/sections/Technologies.tsx'
import { Fidelity } from '../components/ui/Fidelity.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder.tsx'
import { WireframeIntro } from '../components/ui/WireframeIntro.tsx'
import { useHeroProgress } from '../hooks/useHeroProgress.ts'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../i18n/useLocale.ts'

export function Home() {
  const { t } = useLocale()
  const { level, progress } = useHeroProgress(!usePrefersReducedMotion())

  return (
    <div className="mx-auto w-full max-w-6xl">
      <WireframeIntro />
      <div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <Hero level={level} progress={progress} />
          <Skills />
        </div>
        <aside aria-hidden="true" className="hidden md:block">
          <Fidelity
            level={level}
            className="sticky top-[calc(3.5rem+(100vh-3.5rem-var(--H))/2)] mt-[calc((100vh-3.5rem-var(--H))/2-2rem)] [--H:min(56vh,440px)]"
          >
            <div id="wf-01-image" data-fg-from="bottom" className="fg-item">
              <ImagePlaceholder label={t.home.imageAlt} className="h-(--H) [--x:calc(1_-_var(--t))]">
                <Icon icon={faUser} className="text-7xl opacity-70" />
              </ImagePlaceholder>
            </div>
          </Fidelity>
        </aside>
      </div>
      <Technologies />
      <Projects />
      <Social />
      <ContactCta />
    </div>
  )
}
