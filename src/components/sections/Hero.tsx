import { faUser } from '@fortawesome/free-solid-svg-icons'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Fidelity } from '../ui/Fidelity.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'

const bar = 'my-2.5 h-3 rounded-sm bg-gray-500'

export function Hero({ level }: { level: 'lo' | 'mid' }) {
  const { t } = useLocale()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section id="home" className={reduceMotion ? 'min-h-[90vh] py-16' : 'h-[170vh]'}>
      <Fidelity
        level={level}
        className={`flex flex-col justify-center gap-5 ${reduceMotion ? '' : 'sticky top-0 h-[calc(100vh-62px)] md:top-14 md:h-[calc(100vh-3.5rem)]'}`}
      >
        <ImagePlaceholder
          label={t.home.imageAlt}
          className="h-[min(26vh,200px)] [--x:calc(1_-_var(--t))] md:hidden"
        >
          <Icon icon={faUser} className="text-5xl" />
        </ImagePlaceholder>
        <div className="grid">
          <div aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 opacity-[calc(1_-_var(--t))]">
            <span className="mb-2.5 block text-xs">{t.home.wireTag}</span>
            <div className={`${bar} h-[18px] w-[45%]`} />
            <div className="text-lg font-bold">{t.home.wireRole}</div>
            <div className={`${bar} w-[95%]`} />
            <div className={`${bar} w-[82%]`} />
            <div className={`${bar} w-[58%]`} />
            <span className="fx mt-3.5 inline-block px-5 py-3">{t.home.wireCta}</span>
          </div>
          <div
            className={`col-start-1 row-start-1 opacity-(--t) ${level === 'lo' ? 'pointer-events-none' : ''}`}
          >
            <span className="mb-2.5 block text-xs opacity-80">{t.home.tag}</span>
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">{t.home.title}</h1>
            <p className="mb-4 max-w-[34ch] text-lg">{t.home.intro}</p>
            <Button to="#contact" variant="fx">
              {t.home.cta}
            </Button>
          </div>
        </div>
        <p className="text-center text-sm opacity-80">↓ {t.home.scroll}</p>
      </Fidelity>
    </section>
  )
}
