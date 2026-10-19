import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { heroStop, scrollToStop } from '../../utils/stepStops.ts'
import { setIntroPhase } from '../../utils/introPhase.ts'
import type { IntroPhase } from '../../utils/introPhase.ts'

const moveMs = 300
const actionGapMs = 220
const pauseMs = 1000
const buildingMs = 1400
const mobileStepMs = 650
const wireframeRatio = 0.12
const alignTolerance = 2
const purple = '#8a38f5'
const blue = '#0c8ce9'
const orange = '#e03e1a'
const motion = `transform ${moveMs}ms cubic-bezier(0.22, 1, 0.36, 1), translate ${moveMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease`
// The nav keeps its own side-menu ↔ top-bar morph next to the entrance.
const navMotion = `${motion}, width 0.55s cubic-bezier(0.7, 0, 0.2, 1), height 0.55s cubic-bezier(0.7, 0, 0.2, 1)`
const motionFor = (element: HTMLElement) => (element.id === 'wf-00-navbar' ? navMotion : motion)

// Draft layouts the elements pass through before landing, as boxes on a 1365×700 reference viewport.
// Each step is a list of actions played in order: show an element, move it to a draft (or to null,
// its real position), or switch the nav between side-menu and top bar.
type Draft = { x: number; y: number; w: number; h: number }
type Action = { id: string; show?: true; to?: Draft | null; phase?: IntroPhase }

const reference = { width: 1365, height: 700 }
const image = 'wf-01-image'
const title = 'wf-03-title'
const cta = 'wf-08-cta'
const navbar = 'wf-00-navbar'

const steps: Action[][] = [
  [
    { id: image, show: true, to: { x: 560, y: 230, w: 240, h: 230 } },
    { id: title, show: true, to: { x: 560, y: 150, w: 170, h: 28 } },
  ],
  [
    { id: navbar, show: true },
    { id: image, to: { x: 360, y: 230, w: 860, h: 230 } },
  ],
  [
    { id: navbar, phase: 'done' },
    { id: image, to: { x: 870, y: 150, w: 360, h: 380 } },
    { id: title, to: { x: 300, y: 230, w: 240, h: 50 } },
    { id: cta, show: true, to: { x: 345, y: 340, w: 150, h: 60 } },
  ],
  [
    { id: cta, to: null },
    { id: title, to: null },
    { id: image, to: null },
    { id: 'wf-05-text-1', show: true },
    { id: 'wf-06-text-2', show: true },
    { id: 'wf-07-text-3', show: true },
    { id: 'wf-02-tag', show: true },
  ],
]

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

// Unscaled, untranslated rect: where the element really sits in the layout. Transitions are paused
// while measuring, otherwise the rect would still include the entrance offset being animated away.
function finalBox(element: HTMLElement) {
  const { transform, translate, transition } = element.style
  element.style.transition = 'none'
  element.style.transform = 'none'
  element.style.translate = 'none'
  const box = toBox(element.getBoundingClientRect())
  element.style.transform = transform
  element.style.translate = translate
  element.style.transition = transition
  return box
}

function draftTransform(final: Box, draft: Draft) {
  const sx = window.innerWidth / reference.width
  const sy = window.innerHeight / reference.height
  const x = draft.x * sx - final.left
  const y = draft.y * sy - final.top
  return `translate(${x}px, ${y}px) scale(${(draft.w * sx) / final.width}, ${(draft.h * sy) / final.height})`
}

// Plays the lo-fi entrance on Home. Desktop: four drafted layouts, their actions played one after another,
// with a 1 s pause between steps,
// with a Figma-like selection (purple), rulers (blue) and smart guides (orange). Mobile: elements arrive
// one by one in their id order (wf-NN-*).
export function WireframeIntro() {
  const reduceMotion = usePrefersReducedMotion()
  const { t } = useLocale()
  const [selection, setSelection] = useState<Selection | null>(null)
  const [building, setBuilding] = useState(false)

  useEffect(() => {
    const all = [...document.querySelectorAll<HTMLElement>('[id^="wf-"]')]
    const byId = (id: string) => all.find((element) => element.id === id && element.getClientRects().length > 0)
    const showAll = () => all.forEach((element) => (element.dataset.fg = 'in'))
    const reset = () =>
      all.forEach((element) => {
        element.style.transform = ''
        element.style.transition = ''
        element.style.transformOrigin = ''
      })

    if (reduceMotion || window.scrollY > window.innerHeight * wireframeRatio) {
      showAll()
      setIntroPhase('done')
      return
    }

    all.forEach((element) => delete element.dataset.fg)
    const desktop = window.matchMedia('(min-width: 768px)').matches
    let focus: HTMLElement | undefined
    let timer = 0
    let frame = 0
    let finished = false

    const track = () => {
      if (focus) {
        const current = focus
        setSelection({
          box: toBox(current.getBoundingClientRect()),
          placed: all
            .filter((element) => element !== current && element.dataset.fg === 'in' && element.id !== 'wf-00-navbar')
            .map((element) => toBox(element.getBoundingClientRect())),
        })
      }
      frame = requestAnimationFrame(track)
    }

    // A completed intro moves on by itself to the hero's mid-fi state; an interrupted one just resolves.
    const finish = (advance = false) => {
      if (finished) return
      finished = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      setBuilding(false)
      setSelection(null)
      reset()
      showAll()
      setIntroPhase('done')
      if (advance) scrollToStop(heroStop(), false)
    }

    const playDesktop = () => {
      const finals = new Map(all.map((element) => [element.id, finalBox(element)]))
      all.forEach((element) => {
        element.style.transformOrigin = 'top left'
        element.style.transition = motionFor(element)
      })

      const actions = steps.flatMap((step, stepIndex) =>
        step.map((action, actionIndex) => ({ ...action, last: actionIndex === step.length - 1 && stepIndex < steps.length - 1 })),
      )

      const run = (index: number) => {
        if (index >= actions.length) {
          timer = window.setTimeout(() => finish(true), pauseMs)
          return
        }
        const action = actions[index]
        const element = all.find((item) => item.id === action.id && item.getClientRects().length > 0)
        if (action.phase) setIntroPhase(action.phase)
        if (element && action.to !== undefined) {
          const final = finals.get(action.id)
          if (final) element.style.transform = action.to ? draftTransform(final, action.to) : 'none'
        }
        if (element && action.show) element.dataset.fg = 'in'
        if (element) focus = element
        timer = window.setTimeout(() => run(index + 1), action.last ? moveMs + pauseMs : actionGapMs)
      }

      // Hidden elements first jump (without animating) to their first draft, so they enter from there.
      steps.flat().forEach((action) => {
        const element = byId(action.id)
        const final = finals.get(action.id)
        if (action.show && action.to && element && final) {
          element.style.transition = 'none'
          element.style.transform = draftTransform(final, action.to)
        }
      })
      void document.body.offsetWidth
      all.forEach((element) => (element.style.transition = motionFor(element)))
      setIntroPhase('side')
      run(0)
    }

    const playMobile = () => {
      setIntroPhase('done')
      const items = all.filter((element) => element.getClientRects().length > 0).sort((a, b) => a.id.localeCompare(b.id))
      let index = 0
      const next = () => {
        if (index >= items.length) {
          finish(true)
          return
        }
        items[index].dataset.fg = 'in'
        focus = items[index]
        index++
        timer = window.setTimeout(next, mobileStepMs)
      }
      next()
    }

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * wireframeRatio) finish()
    }

    frame = requestAnimationFrame(track)
    setBuilding(true)
    timer = window.setTimeout(() => {
      setBuilding(false)
      if (desktop) playDesktop()
      else playMobile()
    }, buildingMs)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      reset()
    }
  }, [reduceMotion])

  if (building) {
    return (
      <p role="status" className="pointer-events-none fixed inset-0 z-30 grid place-items-center font-mono text-sm text-gray-500">
        <span className="animate-pulse motion-reduce:animate-none">{t.home.building}</span>
      </p>
    )
  }
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
