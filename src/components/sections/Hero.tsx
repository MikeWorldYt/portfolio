import { faUser } from '@fortawesome/free-solid-svg-icons'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Fidelity } from '../ui/Fidelity.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ImagePlaceholder } from '../ui/ImagePlaceholder.tsx'
import { TypedText } from '../ui/TypedText.tsx'

// The title types out over the first part of the lo → mid scroll, the intro over the rest.
const titleShare = 0.35
const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function Hero({ level, progress }: { level: 'lo' | 'mid'; progress: number }) {
  const { t } = useLocale()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section id="home" className={reduceMotion ? 'min-h-[90vh] py-16' : '-mt-8 h-[170vh]'}>
      <Fidelity
        level={level}
        className={`flex flex-col justify-start gap-5 pt-12 md:justify-center md:pt-0 ${reduceMotion ? '' : 'sticky top-0 h-[calc(100vh-62px)] md:top-14 md:h-[calc(100vh-3.5rem)]'}`}
      >
        <div id="wf-01-image-mobile" data-fg-from="bottom" className="fg-item md:hidden">
          <ImagePlaceholder label={t.home.imageAlt} className="h-[min(26vh,200px)] [--x:calc(1_-_var(--t))]">
            <Icon icon={faUser} className="text-5xl" />
          </ImagePlaceholder>
        </div>
        <div>
          <div className="mb-3 grid">
            <span
              id="wf-02-tag"
              data-fg-from="left top"
              aria-hidden="true"
              className="fg-text col-start-1 row-start-1 block w-fit text-sm opacity-[calc(1_-_var(--t))]"
            >
              {t.home.wireTag}
            </span>
            <span className="col-start-1 row-start-1 block text-sm opacity-[calc(var(--t)*0.8)]">{t.home.tag}</span>
          </div>
          {/* Sans in every level, so the lo-fi bars already wrap like the real text they type into. */}
          <h1
            id="wf-03-title"
            data-fg-from="left top"
            className="fg-item mb-5 w-fit font-sans text-5xl leading-[1.05] font-bold md:text-6xl lg:text-7xl"
          >
            <TypedText text={t.home.title} progress={clamp(progress / titleShare)} />
          </h1>
          <p
            id="wf-05-text"
            data-fg-from="right"
            className="fg-item mb-3 w-fit font-sans text-xl leading-relaxed md:max-w-[50vw] lg:text-2xl"
          >
            <TypedText text={t.home.intro} progress={clamp((progress - titleShare) / (1 - titleShare))} />
          </p>
        </div>
        {/* One button for both layers: the lo-fi placeholder label turns into the real call to action. */}
        <div id="wf-08-cta" data-fg-from="bottom" className="fg-item w-fit">
          <Button to="contact" variant="fx" size="lg">
            <span className="grid justify-items-center">
              <span aria-hidden="true" className="col-start-1 row-start-1 opacity-[calc(1_-_var(--t))]">
                {t.home.wireCta}
              </span>
              <span className="col-start-1 row-start-1 opacity-(--t)">{t.home.cta}</span>
            </span>
          </Button>
        </div>
      </Fidelity>
    </section>
  )
}
