import { useSyncExternalStore } from 'react'

// Shared between the lo-fi intro (Home) and the nav (Layout): the nav plays a side-menu
// during the intro and settles as the top bar once the intro moves it there.
export type IntroPhase = 'idle' | 'side' | 'done'

let phase: IntroPhase = 'idle'
const listeners = new Set<() => void>()

export function setIntroPhase(next: IntroPhase) {
  if (next === phase) return
  phase = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useIntroPhase() {
  return useSyncExternalStore(subscribe, () => phase)
}
