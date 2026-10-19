// Scroll stops for the step buttons: hero complete (mid-fi), then each section. The lo-fi top is not a stop,
// so _prev is disabled on the first mid-fi step; going back up there takes a manual scroll.
const heroCompleteRatio = 0.33
const topBarHeight = 56
const tolerance = 8

function getStops(ids: readonly string[]) {
  const offset = window.matchMedia('(min-width: 768px)').matches ? topBarHeight : 0
  const sectionStops = ids.slice(1).map((id) => {
    const element = document.getElementById(id)
    return element ? element.getBoundingClientRect().top + window.scrollY - offset : Infinity
  })
  return [heroStop(), ...sectionStops].filter(Number.isFinite)
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

// Home lands on the legible mid-fi hero, not on the lo-fi wireframe at the very top.
export function scrollToSection(id: string) {
  if (id === 'home') window.scrollTo({ top: heroStop() })
  else document.getElementById(id)?.scrollIntoView()
}

export function scrollToStop(top: number, reduceMotion: boolean) {
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
}
