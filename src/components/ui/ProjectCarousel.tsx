import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { ProjectData } from '../../data/projects.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { ProjectCard } from './ProjectCard.tsx'

const swipeRatio = 0.2
const stepDeg = 13

// Mobile projects as a circular list laid on a wheel: the current card fills the screen, its neighbours
// tilt away at the sides. Dragging turns the wheel with the finger; the ends wrap around.
export function ProjectCarousel({ projects }: { projects: readonly ProjectData[] }) {
  const { t } = useLocale()
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState<number | null>(null)
  // Cards wrapping to the other end of the ring jump there unseen, then fade in, instead of sweeping behind.
  const [wrapping, setWrapping] = useState<string[]>([])
  const start = useRef({ x: 0, width: 1 })
  const count = projects.length

  // Shortest way round the ring, so the last card sits to the left of the first.
  const offsetFrom = (position: number, from: number) => {
    const raw = (position - from + count) % count
    return raw > count / 2 ? raw - count : raw
  }
  const offset = (position: number) => offsetFrom(position, index)

  const go = (step: number) => {
    const next = (index + step + count) % count
    setWrapping(projects.filter((_, position) => Math.abs(offsetFrom(position, next) - offset(position)) > 1).map(({ id }) => id))
    setIndex(next)
  }

  useEffect(() => {
    if (wrapping.length === 0) return
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setWrapping([]))
    })
    return () => cancelAnimationFrame(frame)
  }, [wrapping])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, width: event.currentTarget.offsetWidth || 1 }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag(0)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (drag !== null) setDrag((event.clientX - start.current.x) / start.current.width)
  }
  const onPointerEnd = () => {
    if (drag !== null && Math.abs(drag) >= swipeRatio) go(drag < 0 ? 1 : -1)
    setDrag(null)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') go(-1)
    if (event.key === 'ArrowRight') go(1)
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t.projects.carousel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="-mx-4 mb-6 overflow-x-clip px-4 pb-10 focus-visible:outline-2"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="grid touch-pan-y select-none"
      >
        {projects.map((project, position) => {
          const place = offset(position) + (drag ?? 0)
          const current = offset(position) === 0
          const jumping = wrapping.includes(project.id)
          return (
            <div
              key={project.id}
              inert={!current}
              aria-hidden={!current}
              style={{
                transform: `rotate(${place * stepDeg}deg)`,
                opacity: jumping || Math.abs(place) > 1.5 ? 0 : 1,
                zIndex: current ? 2 : 1,
              }}
              className={`col-start-1 row-start-1 origin-[50%_420%] ${jumping ? '' : drag === null ? 'transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none' : ''}`}
            >
              <ProjectCard project={project} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
