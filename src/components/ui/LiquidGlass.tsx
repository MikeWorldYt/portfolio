import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'

// Lens map for the tiles (5rem = 80px): pixels sample toward the centre, so the backdrop is magnified,
// and the pull grows near the squircle rim, which bends what sits behind the edges.
const lensSize = 80
const lensScale = 80

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function createLensMap() {
  const canvas = document.createElement('canvas')
  canvas.width = lensSize
  canvas.height = lensSize
  const context = canvas.getContext('2d')
  if (!context) return null

  const image = context.createImageData(lensSize, lensSize)
  const half = lensSize / 2
  for (let y = 0; y < lensSize; y++) {
    for (let x = 0; x < lensSize; x++) {
      const nx = (x + 0.5) / half - 1
      const ny = (y + 0.5) / half - 1
      const radius = Math.min(1, Math.pow(nx ** 4 + ny ** 4, 0.25))
      const pull = 0.2 + 0.45 * smoothstep(0.7, 1, radius)
      const index = (y * lensSize + x) * 4
      image.data[index] = Math.round(255 * Math.min(1, Math.max(0, 0.5 - (nx * pull * half) / lensScale)))
      image.data[index + 1] = Math.round(255 * Math.min(1, Math.max(0, 0.5 - (ny * pull * half) / lensScale)))
      image.data[index + 2] = 128
      image.data[index + 3] = 255
    }
  }
  context.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

const chaseReach = 28

// Defines the SVG filter used by liquid-glass.css, enables refraction only in Chromium and moves the glass light with scroll.
export function LiquidGlassFilter() {
  const [lensMap, setLensMap] = useState<string | null>(null)

  useEffect(() => {
    setLensMap(createLensMap())
  }, [])

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

  if (!lensMap) return null

  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter
        id="liquid-glass"
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={lensSize}
        height={lensSize}
        colorInterpolationFilters="sRGB"
      >
        <feImage href={lensMap} x="0" y="0" width={lensSize} height={lensSize} preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={lensScale} xChannelSelector="R" yChannelSelector="G" />
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
