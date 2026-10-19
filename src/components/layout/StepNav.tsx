import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { nextStop, prevStop, scrollToStop } from '../../utils/stepStops.ts'
import { Icon } from '../ui/Icon.tsx'
import { ThemeContext } from '../ui/themeContext.ts'

const idleMs = 30_000
const wireframeRatio = 0.12

const blob = 'absolute bg-zinc-700 in-data-[theme=dark]:bg-white/90'
const motion = 'transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
const circle = 'right-6 size-14 rounded-full'
const hiddenCircle = 'translate-x-12 scale-25'
const button =
  'absolute right-6 grid size-14 place-items-center rounded-full text-xl text-white transition-opacity duration-200 in-data-[theme=dark]:text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2'

// Edge tab with _prev/_next drops, shown once the hero leaves lo-fi: hover or tap the tab to pull the drops out;
// after 30 s unused, or when another component is used, they merge back into the tab (gooey SVG filter).
export function StepNav({ ids }: { ids: readonly string[] }) {
  const { t } = useLocale()
  const theme = useContext(ThemeContext)
  const reduceMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const timerRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(true)
  const [attention, setAttention] = useState(false)
  const [edges, setEdges] = useState({ prev: false, next: true })

  const restartTimer = () => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpen(false), idleMs)
  }

  const show = () => {
    setOpen(true)
    restartTimer()
  }

  useEffect(() => {
    const onScroll = () => {
      setEdges({ prev: prevStop(ids) !== undefined, next: nextStop(ids) !== undefined })
      setReady(window.scrollY > window.innerHeight * wireframeRatio)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(timerRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [ids])

  useEffect(() => {
    if (!ready) return
    setOpen(true)
    setAttention(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpen(false), idleMs)
  }, [ready])

  const go = (target: number | undefined) => {
    restartTimer()
    if (target !== undefined) scrollToStop(target, reduceMotion)
  }

  if (!ready) return null

  // Hi-fi (dark page) swaps the solid goo drops for liquid glass; a filtered parent would break backdrop blur.
  const glass = theme === 'dark'
  const drop = glass ? 'absolute lg-chip' : blob
  const flick = attention ? 'animate-flick motion-reduce:animate-none' : ''

  return (
    <nav
      ref={rootRef}
      aria-label={t.stepNav.label}
      data-theme={theme}
      className="pointer-events-none fixed top-1/2 -right-[3px] max-md:hidden z-20 h-56 w-28 -translate-y-1/2"
    >
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id="step-goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
      </svg>

      <div aria-hidden="true" className={`absolute inset-0 ${glass ? '' : '[filter:url(#step-goo)]'}`}>
        {!glass && <span className={`${blob} top-0 right-0 h-full w-1`} />}
        <span className={`${drop} ${motion} top-1/2 right-0 h-28 w-5 -translate-y-1/2 rounded-l-full ${open ? 'scale-x-60' : ''}`} />
        <span className={`${drop} ${motion} ${circle} top-[calc(50%-4.25rem)] ${open ? '' : hiddenCircle}`} />
        <span className={`${drop} ${motion} ${circle} top-[calc(50%+0.75rem)] delay-75 ${flick} ${open ? '' : hiddenCircle}`} />
      </div>

      <button
        type="button"
        aria-label={t.stepNav.label}
        aria-expanded={open}
        onPointerEnter={show}
        onFocus={show}
        onClick={show}
        className={`pointer-events-auto absolute top-1/2 right-0 h-28 w-6 -translate-y-1/2 ${open ? 'hidden' : ''}`}
      />
      <button
        type="button"
        aria-label={t.stepNav.prev}
        disabled={!edges.prev}
        tabIndex={open ? 0 : -1}
        onClick={() => go(prevStop(ids))}
        className={`${button} top-[calc(50%-4.25rem)] ${open ? 'pointer-events-auto opacity-100' : 'opacity-0'}`}
      >
        <Icon icon={faChevronUp} />
      </button>
      <button
        type="button"
        aria-label={t.stepNav.next}
        disabled={!edges.next}
        tabIndex={open ? 0 : -1}
        onClick={() => go(nextStop(ids))}
        onAnimationEnd={() => setAttention(false)}
        className={`${button} top-[calc(50%+0.75rem)] ${open ? 'pointer-events-auto opacity-100' : 'opacity-0'}`}
      >
        {attention && (
          <>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-wave rounded-full border-2 border-red-500 motion-reduce:hidden" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-wave rounded-full border-2 border-red-500 [animation-delay:0.4s] motion-reduce:hidden" />
          </>
        )}
        <Icon icon={faChevronDown} />
      </button>
    </nav>
  )
}
