import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { heroStop } from '../../utils/stepStops.ts'
import { setIntroPhase } from '../../utils/introPhase.ts'
import type { IntroPhase } from '../../utils/introPhase.ts'

const moveMs = 300
const actionGapMs = 220
const mobileStepMs = 650
const glideMs = 2600
// Motion blur strength: px of blur per px travelled at peak speed, capped per axis.
const blurPerPx = 1 / 5
const maxBlur = 1
const wireframeRatio = 0.12
const alignTolerance = 2
const purple = '#8a38f5'
const blue = '#0c8ce9'
const orange = '#e03e1a'
const motion = (ms: number) =>
  `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1), translate ${ms}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease`
// The nav keeps its own side-menu ↔ top-bar morph next to the entrance.
const motionFor = (element: HTMLElement, ms = moveMs) =>
  element.id === 'wf-00-navbar'
    ? `${motion(ms)}, width 0.55s cubic-bezier(0.7, 0, 0.2, 1), height 0.55s cubic-bezier(0.7, 0, 0.2, 1)`
    : motion(ms)

// Draft layouts the elements pass through before landing, as boxes on a 1365×700 reference viewport.
// Each step lists actions: show an element, move it to a draft (or to null, its real position), or switch
// the nav between side-menu and top bar. Actions play one after another, or all at once in a `together` step,
// whose selection shows `groups` (several ids selected as one auto-layout group); `centered` adds the guides
// that centre an element between the top bar and the bottom of the viewport.
type Draft = { x: number; y: number; w: number; h: number }
type Action = { id: string; show?: true; to?: Draft | null; phase?: IntroPhase }
type Step = { actions: Action[]; together?: true; groups?: string[][]; centered?: string; moveMs?: number; pauseMs: number }

const reference = { width: 1365, height: 700 }
const image = 'wf-01-image'
const title = 'wf-03-title'
const cta = 'wf-08-cta'
const navbar = 'wf-00-navbar'

const steps: Step[] = [
  {
    actions: [
      { id: image, show: true, to: { x: 560, y: 230, w: 240, h: 230 } },
      { id: title, show: true, to: { x: 560, y: 150, w: 170, h: 28 } },
    ],
    pauseMs: 0,
  },
  {
    actions: [
      { id: navbar, show: true },
      { id: image, to: { x: 240, y: 215, w: 1060, h: 420 } },
    ],
    together: true,
    groups: [[navbar], [image]],
    pauseMs: 0,
  },
  {
    actions: [
      { id: navbar, phase: 'done' },
      { id: image, to: { x: 690, y: 70, w: 650, h: 560 } },
      { id: title, to: { x: 300, y: 230, w: 240, h: 50 } },
      { id: cta, show: true, to: { x: 345, y: 340, w: 150, h: 60 } },
    ],
    together: true,
    groups: [[title, cta], [image]],
    pauseMs: 300,
  },
  {
    actions: [
      { id: cta, to: null },
      { id: title, to: null },
      { id: image, to: null },
      { id: 'wf-05-text', show: true },
      { id: 'wf-02-tag', show: true },
    ],
    together: true,
    groups: [['wf-02-tag', title, 'wf-05-text', cta], [image]],
    centered: image,
    moveMs: 600,
    pauseMs: 400,
  },
]

// Slow eased scroll into mid-fi, so the hero has time to type itself out; any user input takes over.
function glideTo(top: number) {
  const start = window.scrollY
  const began = performance.now()
  let frame = 0
  const stop = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
  }
  const step = (now: number) => {
    const linear = Math.min(1, (now - began) / glideMs)
    const eased = linear < 0.5 ? 2 * linear * linear : 1 - (-2 * linear + 2) ** 2 / 2
    window.scrollTo({ top: start + (top - start) * eased, behavior: 'instant' })
    if (linear < 1) frame = requestAnimationFrame(step)
    else stop()
  }
  window.addEventListener('wheel', stop, { passive: true })
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('keydown', stop)
  frame = requestAnimationFrame(step)
}

const movingIds = [...new Set(steps.flatMap((step) => step.actions.filter((action) => action.to !== undefined).map((action) => action.id)))]
const blurId = (id: string) => `motion-blur-${id}`

// The intro plays once per page load; coming back to Home from another route lands straight on the content.
let introPlayed = false

type Box = { left: number; top: number; width: number; height: number; right: number; bottom: number }

const toBox = (rect: DOMRect): Box => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
  right: rect.right,
  bottom: rect.bottom,
})

type Selection = { box: Box; placed: Box[]; children?: Box[]; center?: { top: number; bottom: number } }

const union = (boxes: Box[]): Box => {
  const left = Math.min(...boxes.map((box) => box.left))
  const top = Math.min(...boxes.map((box) => box.top))
  const right = Math.max(...boxes.map((box) => box.right))
  const bottom = Math.max(...boxes.map((box) => box.bottom))
  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

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

// Plays the lo-fi entrance on Home. Desktop: four drafted layouts timed per step,
// with a Figma-like selection (purple), rulers (blue) and smart guides (orange). Mobile: elements arrive
// one by one in their id order (wf-NN-*).
export function WireframeIntro() {
  const reduceMotion = usePrefersReducedMotion()
  const { t } = useLocale()
  const [selections, setSelections] = useState<Selection[]>([])
  const [building, setBuilding] = useState(false)

  useEffect(() => {
    const all = [...document.querySelectorAll<HTMLElement>('[id^="wf-"]')]
    const byId = (id: string) => all.find((element) => element.id === id && element.getClientRects().length > 0)
    const showAll = () => all.forEach((element) => (element.dataset.fg = 'in'))
    // Scrolling is locked while the intro plays; the stable gutter keeps the layout from shifting when it unlocks.
    const root = document.documentElement
    const lockScroll = (locked: boolean) => {
      root.style.overflow = locked ? 'hidden' : ''
      root.style.scrollbarGutter = locked ? 'stable' : ''
    }
    // The hero copy rides above the nav while the nav morphs into the top bar across it.
    const stage = document.getElementById('home')?.firstElementChild as HTMLElement | null | undefined
    const raiseStage = (raised: boolean) => {
      if (stage) stage.style.zIndex = raised ? '11' : ''
    }
    const reset = () =>
      all.forEach((element) => {
        element.style.transform = ''
        element.style.transition = ''
        element.style.transformOrigin = ''
        element.style.filter = ''
      })

    if (introPlayed || window.location.hash || reduceMotion || window.scrollY > window.innerHeight * wireframeRatio) {
      showAll()
      setIntroPhase('done')
      if (introPlayed && !window.location.hash) window.scrollTo({ top: heroStop(), behavior: 'instant' })
      return
    }

    all.forEach((element) => delete element.dataset.fg)
    const desktop = window.matchMedia('(min-width: 768px)').matches
    // Each target is one element, or several selected as a group.
    let focus: HTMLElement[][] = []
    let centered: HTMLElement | undefined
    let timer = 0
    const blurFrames = new Set<number>()
    // After Effects-like motion blur: a directional blur along the move that peaks with the ease-out's speed.
    const blurMove = (element: HTMLElement, dx: number, dy: number, ms: number) => {
      const node = document.querySelector(`#${blurId(element.id)} feGaussianBlur`)
      if (!node || ms <= 0) return
      const peakX = Math.min(maxBlur, Math.abs(dx) * blurPerPx)
      const peakY = Math.min(maxBlur, Math.abs(dy) * blurPerPx)
      if (peakX < 0.5 && peakY < 0.5) return
      element.style.filter = `url(#${blurId(element.id)})`
      const began = performance.now()
      const tick = (now: number) => {
        blurFrames.delete(frameId)
        const linear = Math.min(1, (now - began) / ms)
        const speed = 6.75 * linear * (1 - linear) ** 2
        node.setAttribute('stdDeviation', `${peakX * speed} ${peakY * speed}`)
        if (linear < 1) {
          frameId = requestAnimationFrame(tick)
          blurFrames.add(frameId)
        } else element.style.filter = ''
      }
      let frameId = requestAnimationFrame(tick)
      blurFrames.add(frameId)
    }
    const stopBlur = () => {
      blurFrames.forEach((id) => cancelAnimationFrame(id))
      blurFrames.clear()
    }
    let frame = 0
    let finished = false

    const track = () => {
      if (focus.length > 0) {
        const targets = focus
        setSelections(
          targets.map((target) => {
            if (target.length > 1) {
              const children = target.map((element) => toBox(element.getBoundingClientRect()))
              return { box: union(children), placed: [], children }
            }
            const current = target[0]
            const bar = current === centered ? byId(navbar) : undefined
            return {
              center: bar && { top: bar.getBoundingClientRect().bottom, bottom: window.innerHeight },
              box: toBox(current.getBoundingClientRect()),
              placed:
                targets.length > 1
                  ? []
                  : all
                      .filter((element) => element !== current && element.dataset.fg === 'in' && element.id !== 'wf-00-navbar')
                      .map((element) => toBox(element.getBoundingClientRect())),
            }
          }),
        )
      }
      frame = requestAnimationFrame(track)
    }

    // A completed intro moves on by itself to the hero's mid-fi state; an interrupted one just resolves.
    const finish = (advance = false) => {
      if (finished) return
      finished = true
      introPlayed = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      stopBlur()
      setBuilding(false)
      setSelections([])
      reset()
      raiseStage(false)
      lockScroll(false)
      showAll()
      setIntroPhase('done')
      if (advance) glideTo(heroStop())
    }

    const playDesktop = () => {
      const finals = new Map(all.map((element) => [element.id, finalBox(element)]))
      all.forEach((element) => {
        element.style.transformOrigin = 'top left'
        element.style.transition = motionFor(element)
      })

      const apply = (action: Action, ms: number) => {
        const element = byId(action.id)
        if (action.phase) setIntroPhase(action.phase)
        if (!element) return undefined
        element.style.transition = motionFor(element, ms)
        if (action.to !== undefined) {
          const final = finals.get(action.id)
          if (final) {
            const from = element.getBoundingClientRect()
            const sx = window.innerWidth / reference.width
            const sy = window.innerHeight / reference.height
            const to = action.to
              ? { x: (action.to.x + action.to.w / 2) * sx, y: (action.to.y + action.to.h / 2) * sy }
              : { x: final.left + final.width / 2, y: final.top + final.height / 2 }
            element.style.transform = action.to ? draftTransform(final, action.to) : 'none'
            blurMove(element, to.x - (from.left + from.width / 2), to.y - (from.top + from.height / 2), ms)
          }
        }
        if (action.show) element.dataset.fg = 'in'
        return element
      }

      const run = (stepIndex: number, actionIndex = 0) => {
        const step = steps[stepIndex]
        if (!step) {
          finish(true)
          return
        }
        const ms = step.moveMs ?? moveMs
        const settle = () => (timer = window.setTimeout(() => run(stepIndex + 1), ms + step.pauseMs))
        if (step.together) {
          step.actions.forEach((action) => apply(action, ms))
          focus = (step.groups ?? []).map((ids) => ids.map(byId).filter((item): item is HTMLElement => !!item))
          centered = step.centered ? byId(step.centered) : undefined
          settle()
          return
        }
        const element = apply(step.actions[actionIndex], ms)
        if (element) focus = [[element]]
        if (actionIndex < step.actions.length - 1) timer = window.setTimeout(() => run(stepIndex, actionIndex + 1), actionGapMs)
        else settle()
      }

      // Hidden elements first jump (without animating) to their first draft, so they enter from there.
      steps.flatMap((step) => step.actions).forEach((action) => {
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
      raiseStage(true)
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
        focus = [[items[index]]]
        index++
        timer = window.setTimeout(next, mobileStepMs)
      }
      next()
    }

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * wireframeRatio) finish()
    }
    // Scroll is locked meanwhile, so a click or Esc is the way to skip straight to the hero.
    const skip = () => finish(true)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip()
    }

    frame = requestAnimationFrame(track)
    lockScroll(true)
    setBuilding(true)
    if (desktop) playDesktop()
    else playMobile()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      stopBlur()
      reset()
      raiseStage(false)
      lockScroll(false)
    }
  }, [reduceMotion])

  // The message stays for the whole intro, low on the screen so it never covers the drafted layout.
  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        {movingIds.map((id) => (
          <filter key={id} id={blurId(id)} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="0" />
          </filter>
        ))}
      </svg>
      {building && (
        <p
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-20 z-30 text-center font-mono text-sm text-gray-500 md:bottom-8"
        >
          <span className="animate-pulse motion-reduce:animate-none">{t.home.building}</span>
        </p>
      )}
      {selections.map((selection, index) => (
        <SelectionOverlay key={index} {...selection} />
      ))}
    </>
  )
}

function SelectionOverlay({ box, placed, children, center }: Selection) {
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 2
  const handles = [
    [box.left, box.top],
    [box.right, box.top],
    [box.left, box.bottom],
    [box.right, box.bottom],
  ]

  const alignments = children ? groupAlignment(box, children) : (['left', 'right'] as const).flatMap((edge) => {
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
  const spans = center
    ? [
        { from: center.top, to: box.top },
        { from: box.bottom, to: center.bottom },
      ].filter((span) => span.to - span.from >= 1)
    : []
  const gaps = children ? groupGaps(children) : [
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

      {spans.map((span) => (
        <span key={`center-${span.from}`}>
          <span className="absolute border-l border-dotted" style={{ left: centerX, top: span.from, height: span.to - span.from, borderColor: orange }} />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm px-1 py-px"
            style={{ left: centerX, top: (span.from + span.to) / 2, backgroundColor: orange }}
          >
            {Math.round(span.to - span.from)}
          </span>
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

type Gap = { from: number; to: number; x: number }

// Auto-layout guides: the shared left edge of the group and the spacing between its stacked children.
function groupAlignment(box: Box, children: Box[]) {
  const aligned = children.filter((child) => Math.abs(child.left - box.left) <= alignTolerance)
  if (aligned.length < 2) return []
  return [
    {
      x: box.left,
      top: Math.min(...aligned.map((child) => child.top)),
      bottom: Math.max(...aligned.map((child) => child.bottom)),
      marks: aligned.flatMap((child) => [child.top, child.bottom]),
    },
  ]
}

function groupGaps(children: Box[]): Gap[] {
  const stacked = [...children].sort((a, b) => a.top - b.top)
  return stacked
    .slice(1)
    .map((child, index) => {
      const above = stacked[index]
      return { from: above.bottom, to: child.top, x: Math.max(above.left, child.left) + 16 }
    })
    .filter((gap) => gap.to - gap.from >= 1)
}
