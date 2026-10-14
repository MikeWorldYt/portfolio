import { faCode, faEnvelope, faFolderOpen, faHouse, faShareNodes, faStar } from '@fortawesome/free-solid-svg-icons'

export const sections = [
  { id: 'home', icon: faHouse },
  { id: 'skills', icon: faStar },
  { id: 'technologies', icon: faCode },
  { id: 'projects', icon: faFolderOpen },
  { id: 'social', icon: faShareNodes },
  { id: 'contact', icon: faEnvelope },
] as const

export type SectionId = (typeof sections)[number]['id']
