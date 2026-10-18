// Scroll stops shared by the background click and the step buttons: top, hero complete, then each section.
const heroCompleteRatio = 0.33
const topBarHeight = 56
const tolerance = 8

function getStops(ids: readonly string[]) {
  const offset = window.matchMedia('(min-width: 768px)').matches ? topBarHeight : 0
  const sectionStops = ids.slice(1).map((id) => {
    const element = document.getElementById(id)
    return element ? element.getBoundingClientRect().top + window.scrollY - offset : Infinity
  })
  return [0, heroStop(), ...sectionStops].filter(Number.isFinite)
}

export function heroStop() {
  return window.innerHeight * heroCompleteRatio
}

export function nextStop(ids: readonly string[]) {
  return getStops(ids).find((stop) => stop > window.scrollY + tolerance)
}

export function prevStop(ids: readonly string[]) {
  return getStops(ids)
    .reverse()
    .find((stop) => stop < window.scrollY - tolerance)
}

export function scrollToStop(top: number, reduceMotion: boolean) {
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
}
