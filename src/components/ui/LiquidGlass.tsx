import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'

// Displacement map for the refraction (generated 160x160 squircle lens).
const MAP =
  'data:image/png;base64,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'

const chaseReach = 28

// Defines the SVG filter used by liquid-glass.css, enables refraction only in Chromium and moves the glass light with scroll.
export function LiquidGlassFilter() {
  useEffect(() => {
    const root = document.documentElement
    if (/Chrom(e|ium)\//.test(navigator.userAgent)) root.classList.add('lg-refract')

    const update = () => {
      const progress = (window.scrollY / window.innerHeight) * Math.PI
      root.style.setProperty('--lg-light-x', `${50 + 35 * Math.sin(progress)}%`)
      root.style.setProperty('--lg-light-y', `${20 + 15 * Math.cos(progress)}%`)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter
        id="liquid-glass"
        primitiveUnits="objectBoundingBox"
        x="0"
        y="0"
        width="1"
        height="1"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={MAP} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur" />
        <feDisplacementMap in="blur" in2="map" scale="0.45" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feColorMatrix in="displaced" type="saturate" values="1.5" />
      </filter>
    </svg>
  )
}

export function GlassTile({ icon, label }: { icon: string; label: string }) {
  const glassRef = useRef<HTMLSpanElement>(null)
  const releaseRef = useRef<(() => void) | null>(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => () => releaseRef.current?.(), [])

  const onLeave = (event: PointerEvent<HTMLSpanElement>) => {
    const glass = glassRef.current
    if (reduceMotion || !glass) return

    const rect = glass.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const radius = rect.width / 2

    const release = () => {
      window.removeEventListener('pointermove', onMove)
      releaseRef.current = null
      glass.classList.remove('is-chasing')
      glass.style.setProperty('--pull-x', '0px')
      glass.style.setProperty('--pull-y', '0px')
      glass.style.setProperty('--sx', '1')
      glass.style.setProperty('--sy', '1')
      glass.classList.remove('is-jelly')
      void glass.offsetWidth
      glass.classList.add('is-jelly')
    }

    const chase = (x: number, y: number) => {
      const distance = Math.hypot(x - centerX, y - centerY) || 1
      const beyond = Math.max(0, distance - radius)
      if (beyond > chaseReach) {
        release()
        return
      }
      const unitX = (x - centerX) / distance
      const unitY = (y - centerY) / distance
      const stretch = (beyond / chaseReach) * 0.12
      glass.style.setProperty('--pull-x', `${unitX * beyond * 0.35}px`)
      glass.style.setProperty('--pull-y', `${unitY * beyond * 0.35}px`)
      glass.style.setProperty('--sx', `${1 + stretch * Math.abs(unitX) - (stretch / 2) * Math.abs(unitY)}`)
      glass.style.setProperty('--sy', `${1 + stretch * Math.abs(unitY) - (stretch / 2) * Math.abs(unitX)}`)
    }

    const onMove = (moveEvent: globalThis.PointerEvent) => chase(moveEvent.clientX, moveEvent.clientY)

    releaseRef.current?.()
    releaseRef.current = release
    glass.classList.remove('is-jelly')
    glass.classList.add('is-chasing')
    chase(event.clientX, event.clientY)
    window.addEventListener('pointermove', onMove)
  }

  return (
    <div className="lg-tile">
      <span
        ref={glassRef}
        className="lg-glass"
        onPointerEnter={() => releaseRef.current?.()}
        onPointerLeave={onLeave}
        onAnimationEnd={(event) => event.currentTarget.classList.remove('is-jelly')}
      >
        <img className="lg-icon" src={icon} alt="" />
      </span>
      <span className="lg-label">{label}</span>
    </div>
  )
}
