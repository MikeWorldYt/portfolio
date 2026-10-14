import type { Dictionary } from '../types.ts'

export const es: Dictionary = {
  site: {
    name: 'Portafolio',
  },
  nav: {
    label: 'Principal',
    items: {
      home: 'Inicio',
      skills: 'Skills',
      technologies: 'Tech',
      projects: 'Proyectos',
      social: 'Redes',
      contact: 'Contacto',
    },
    skipToContent: 'Saltar al contenido',
  },
  footer: {
    rights: 'Todos los derechos reservados',
  },
  localeSwitch: {
    label: 'Cambiar idioma',
  },
  home: {
    wireTag: '[ Hero · Sobre mí ]',
    wireRole: 'Product Engineer',
    wireCta: '[ CTA ]',
    tag: 'Product Engineer · UX',
    title: 'Hola, soy Mike',
    intro: 'Construyo productos digitales con visión de UX y profundidad técnica, acelerados con IA.',
    cta: 'Hablemos',
    scroll: 'Scroll',
    imageAlt: 'Imagen de ejemplo',
    imageCaption: 'tu imagen aquí',
  },
  skills: {
    title: 'Skills',
    intro: 'Profundidad con mentalidad de producto.',
    items: {
      architecture: 'Arquitectura',
      productDesign: 'Diseño de producto',
      prototyping: 'Prototipado',
      accessibility: 'Accesibilidad',
      apis: 'APIs',
      automations: 'Automatizaciones',
      aiAgents: 'Agentes de IA',
      llmIntegrations: 'Integraciones LLM',
    },
  },
  technologies: {
    title: 'Tecnologías',
    intro: 'Herramientas con las que construyo.',
  },
  projects: {
    title: 'Proyectos',
    intro: 'Trabajo seleccionado.',
    readMore: 'Ver más',
    items: {
      one: { title: 'Proyecto uno', description: 'Descripción corta orientada a resultados.' },
      two: { title: 'Proyecto dos', description: 'Descripción corta orientada a resultados.' },
      three: { title: 'Proyecto tres', description: 'Descripción corta orientada a resultados.' },
    },
  },
  social: {
    title: 'Redes sociales',
    intro: 'Encuéntrame en:',
  },
  contactCta: {
    title: '¿Tienes un producto por construir?',
    text: 'Cuéntame y respondo en 48 h.',
    cta: 'Contacto',
  },
  contact: {
    title: 'Contacto',
  },
  notFound: {
    title: 'Página no encontrada',
    back: 'Volver al inicio',
  },
}
