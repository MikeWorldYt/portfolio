import { faUser } from '@fortawesome/free-solid-svg-icons'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Fidelity } from '../ui/Fidelity.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'
import { entranceOffset } from '../ui/WireframeIntro.tsx'

const bar = 'my-3 h-4 rounded-sm bg-gray-500'

export function Hero({ level }: { level: 'lo' | 'mid' }) {
  const { t } = useLocale()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section id="home" className={reduceMotion ? 'min-h-[90vh] py-16' : 'h-[170vh]'}>
      <Fidelity
        level={level}
        className={`flex flex-col justify-center gap-5 ${reduceMotion ? '' : 'sticky top-0 h-[calc(100vh-62px)] md:top-14 md:h-[calc(100vh-3.5rem)]'}`}
      >
        <div data-fg-step="1" className="fg-item md:hidden" style={entranceOffset(40, 30)}>
          <ImagePlaceholder label={t.home.imageAlt} className="h-[min(26vh,200px)] [--x:calc(1_-_var(--t))]">
            <Icon icon={faUser} className="text-5xl" />
          </ImagePlaceholder>
        </div>
        <div className="grid">
          <div
            aria-hidden="true"
            className={`col-start-1 row-start-1 opacity-[calc(1_-_var(--t))] ${level === 'lo' ? '' : 'pointer-events-none'}`}
          >
            <span data-fg-step="2" className="fg-text mb-3 block w-fit text-sm" style={entranceOffset(-30, -10)}>
              {t.home.wireTag}
            </span>
            <div data-fg-step="3" className={`${bar} fg-item mb-5 h-14 w-[55%]`} style={entranceOffset(-50, 20)} />
            <div data-fg-step="4" className="fg-text w-fit text-xl font-bold" style={entranceOffset(20, -20)}>
              {t.home.wireRole}
            </div>
            <div data-fg-step="5" className={`${bar} fg-item w-[95%]`} style={entranceOffset(-40, 0)} />
            <div data-fg-step="6" className={`${bar} fg-item w-[82%]`} style={entranceOffset(30, 10)} />
            <div data-fg-step="7" className={`${bar} fg-item w-[58%]`} style={entranceOffset(-20, 20)} />
            <span
              data-fg-step="8"
              className="fx fg-item mt-6 inline-block px-8 py-4 text-lg"
              style={entranceOffset(30, 30)}
            >
              {t.home.wireCta}
            </span>
          </div>
          <div
            className={`col-start-1 row-start-1 opacity-(--t) ${level === 'lo' ? 'pointer-events-none' : ''}`}
          >
            <span className="mb-3 block text-sm opacity-80">{t.home.tag}</span>
            <h1 className="mb-5 text-5xl leading-[1.05] font-bold md:text-6xl lg:text-7xl">{t.home.title}</h1>
            <p className="mb-8 text-xl leading-relaxed md:max-w-[50vw] lg:text-2xl">{t.home.intro}</p>
            <Button to="#contact" variant="fx" size="lg">
              {t.home.cta}
            </Button>
          </div>
        </div>
        <p className="text-sm opacity-80">↓ {t.home.scroll}</p>
      </Fidelity>
    </section>
  )
}
