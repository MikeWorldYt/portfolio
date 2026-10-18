import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'

const stepMs = 650
const wireframeRatio = 0.12
const purple = '#8a38f5'
const blue = '#0c8ce9'

type Box = { left: number; top: number; width: number; height: number }

const toBox = (rect: DOMRect): Box => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })

// Start offset an element drops in from during the lo-fi entrance.
export const entranceOffset = (x: number, y: number) => ({ '--fg-dx': `${x}px`, '--fg-dy': `${y}px` }) as CSSProperties

// Plays the lo-fi entrance: each [data-fg-step] element drops into place while a Figma-like
// purple selection (handles, size label, blue rulers to the viewport edges) follows it.
export function WireframeIntro() {
  const reduceMotion = usePrefersReducedMotion()
  const [selection, setSelection] = useState<Box | null>(null)

  useEffect(() => {
    const all = [...document.querySelectorAll<HTMLElement>('[data-fg-step]')]
    const showAll = () => all.forEach((element) => (element.dataset.fg = 'in'))
    if (reduceMotion || window.scrollY > window.innerHeight * wireframeRatio) {
      showAll()
      return
    }

    all.forEach((element) => delete element.dataset.fg)
    const items = all
      .filter((element) => element.getClientRects().length > 0)
      .sort((a, b) => Number(a.dataset.fgStep) - Number(b.dataset.fgStep))
    let index = 0
    let timer = 0
    let frame = 0

    const track = () => {
      const element = items[index]
      if (element) setSelection(toBox(element.getBoundingClientRect()))
      frame = requestAnimationFrame(track)
    }

    const finish = () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      index = items.length
      setSelection(null)
      showAll()
    }

    const next = () => {
      if (index >= items.length) {
        finish()
        return
      }
      items[index].dataset.fg = 'in'
      timer = window.setTimeout(() => {
        index++
        next()
      }, stepMs)
    }

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * wireframeRatio) finish()
    }

    frame = requestAnimationFrame(track)
    next()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  if (!selection) return null
  const box = selection
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 2
  const handles = [
    [box.left, box.top],
    [box.left + box.width, box.top],
    [box.left, box.top + box.height],
    [box.left + box.width, box.top + box.height],
  ]

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <span
        className="absolute top-0 border-l border-dashed"
        style={{ left: centerX, height: Math.max(0, box.top), borderColor: blue }}
      />
      <span
        className="absolute left-0 border-t border-dashed"
        style={{ top: centerY, width: Math.max(0, box.left), borderColor: blue }}
      />
      <span className="absolute border" style={{ ...box, borderColor: purple }} />
      {handles.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border bg-white"
          style={{ left: x, top: y, borderColor: purple }}
        />
      ))}
      <span
        className="absolute -translate-x-1/2 rounded-sm px-1.5 py-0.5 font-sans text-[11px] text-white"
        style={{ left: centerX, top: box.top + box.height + 8, backgroundColor: purple }}
      >
        {Math.round(box.width)} × {Math.round(box.height)}
      </span>
    </div>
  )
}
