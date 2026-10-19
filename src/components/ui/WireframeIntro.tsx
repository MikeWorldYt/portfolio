import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'

const stepMs = 800
const wireframeRatio = 0.12
const alignTolerance = 2
const purple = '#8a38f5'
const blue = '#0c8ce9'
const orange = '#e03e1a'

type Box = { left: number; top: number; width: number; height: number; right: number; bottom: number }

const toBox = (rect: DOMRect): Box => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
  right: rect.right,
  bottom: rect.bottom,
})

type Selection = { box: Box; placed: Box[] }

// Plays the lo-fi entrance: each id="wf-NN-*" element drops into place, in NN order, while a Figma-like
// purple selection follows it, with blue rulers to the viewport edges and orange smart guides
// (shared edges and gaps) against the elements already placed.
export function WireframeIntro() {
  const reduceMotion = usePrefersReducedMotion()
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    const all = [...document.querySelectorAll<HTMLElement>('[id^="wf-"]')]
    const showAll = () => all.forEach((element) => (element.dataset.fg = 'in'))
    if (reduceMotion || window.scrollY > window.innerHeight * wireframeRatio) {
      showAll()
      return
    }

    all.forEach((element) => delete element.dataset.fg)
    const items = all.filter((element) => element.getClientRects().length > 0).sort((a, b) => a.id.localeCompare(b.id))
    let index = 0
    let timer = 0
    let frame = 0

    const track = () => {
      const element = items[index]
      if (element) {
        setSelection({
          box: toBox(element.getBoundingClientRect()),
          placed: items.slice(0, index).map((item) => toBox(item.getBoundingClientRect())),
        })
      }
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
  return <SelectionOverlay {...selection} />
}

function SelectionOverlay({ box, placed }: Selection) {
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 2
  const handles = [
    [box.left, box.top],
    [box.right, box.top],
    [box.left, box.bottom],
    [box.right, box.bottom],
  ]

  const alignments = (['left', 'right'] as const).flatMap((edge) => {
    const matches = placed.filter((other) => Math.abs(other[edge] - box[edge]) <= alignTolerance)
    if (matches.length === 0) return []
    const boxes = [box, ...matches]
    return [
      {
        x: box[edge],
        top: Math.min(...boxes.map((item) => item.top)),
        bottom: Math.max(...boxes.map((item) => item.bottom)),
        marks: boxes.flatMap((item) => [item.top, item.bottom]),
      },
    ]
  })

  const overlaps = (other: Box) => other.left < box.right && other.right > box.left
  const above = placed.filter((other) => overlaps(other) && other.bottom <= box.top).sort((a, b) => b.bottom - a.bottom)[0]
  const below = placed.filter((other) => overlaps(other) && other.top >= box.bottom).sort((a, b) => a.top - b.top)[0]
  const gaps = [
    above && { from: above.bottom, to: box.top, x: Math.max(box.left, above.left) + 16 },
    below && { from: box.bottom, to: below.top, x: Math.max(box.left, below.left) + 16 },
  ].filter((gap): gap is { from: number; to: number; x: number } => !!gap && gap.to - gap.from >= 1)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 font-sans text-[11px] text-white">
      <span className="absolute top-0 border-l border-dashed" style={{ left: centerX, height: Math.max(0, box.top), borderColor: blue }} />
      <span className="absolute left-0 border-t border-dashed" style={{ top: centerY, width: Math.max(0, box.left), borderColor: blue }} />

      {alignments.map((line) => (
        <span key={`align-${line.x}`}>
          <span className="absolute border-l" style={{ left: line.x, top: line.top, height: line.bottom - line.top, borderColor: orange }} />
          {line.marks.map((y) => (
            <span
              key={`mark-${line.x}-${y}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 leading-none font-bold"
              style={{ left: line.x, top: y, color: orange }}
            >
              ×
            </span>
          ))}
        </span>
      ))}

      {gaps.map((gap) => (
        <span key={`gap-${gap.from}`}>
          <span className="absolute border-l" style={{ left: gap.x, top: gap.from, height: gap.to - gap.from, borderColor: orange }} />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm px-1 py-px"
            style={{ left: gap.x, top: (gap.from + gap.to) / 2, backgroundColor: orange }}
          >
            {Math.round(gap.to - gap.from)}
          </span>
        </span>
      ))}

      <span
        className="absolute border"
        style={{ left: box.left, top: box.top, width: box.width, height: box.height, borderColor: purple }}
      />
      {handles.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border bg-white"
          style={{ left: x, top: y, borderColor: purple }}
        />
      ))}
      <span
        className="absolute -translate-x-1/2 rounded-sm px-1.5 py-0.5"
        style={{ left: centerX, top: box.bottom + 8, backgroundColor: purple }}
      >
        {Math.round(box.width)} × {Math.round(box.height)}
      </span>
    </div>
  )
}
