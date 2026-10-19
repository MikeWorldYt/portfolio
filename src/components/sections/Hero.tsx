import { faUser } from '@fortawesome/free-solid-svg-icons'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Fidelity } from '../ui/Fidelity.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'

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
        <div id="wf-01-image-mobile" data-fg-from="bottom" className="fg-item md:hidden">
          <ImagePlaceholder label={t.home.imageAlt} className="h-[min(26vh,200px)] [--x:calc(1_-_var(--t))]">
            <Icon icon={faUser} className="text-5xl" />
          </ImagePlaceholder>
        </div>
        <div className="grid">
          <div
            aria-hidden="true"
            className={`col-start-1 row-start-1 opacity-[calc(1_-_var(--t))] ${level === 'lo' ? '' : 'pointer-events-none'}`}
          >
            <span id="wf-02-tag" data-fg-from="left top" className="fg-text mb-3 block w-fit text-sm">
              {t.home.wireTag}
            </span>
            <div id="wf-03-title" data-fg-from="left top" className={`${bar} fg-item mb-5 h-14 w-[55%]`} />
            <div id="wf-05-text-1" data-fg-from="right" className={`${bar} fg-item w-[95%]`} />
            <div id="wf-06-text-2" data-fg-from="right" className={`${bar} fg-item w-[82%]`} />
            <div id="wf-07-text-3" data-fg-from="right" className={`${bar} fg-item w-[58%]`} />
            <span id="wf-08-cta" data-fg-from="bottom" className="fx fg-item mt-6 inline-block px-8 py-4 text-lg">
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
      </Fidelity>
    </section>
  )
}
