import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'

export function Hero() {
  const { t } = useLocale()

  return (
    <section id="home" className="flex min-h-[90vh] flex-col justify-center gap-5 py-16">
      <ImagePlaceholder label={t.home.imageAlt} className="h-48 md:hidden">
        <Icon icon={faUser} className="text-5xl" />
      </ImagePlaceholder>
      <span className="text-xs opacity-80">{t.home.tag}</span>
      <h1 className="text-4xl font-bold md:text-5xl">{t.home.title}</h1>
      <p className="max-w-[34ch] text-lg">{t.home.intro}</p>
      <div>
        <Button to="#contact">{t.home.cta}</Button>
      </div>
      <p className="text-center text-sm opacity-70">↓ {t.home.scroll}</p>
    </section>
  )
}
