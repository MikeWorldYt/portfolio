import type { Dictionary } from '../types.ts'

export const es: Dictionary = {
  site: {
    name: 'Portafolio',
  },
  meta: {
    title: 'Mike | Product Engineer · UX',
    description: 'Portafolio de un Product Engineer: productos digitales con visión de UX y profundidad técnica, acelerados con IA.',
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
  stepNav: {
    label: 'Navegación por pasos',
    prev: '_prev',
    next: '_next',
  },
  footer: {
    rights: 'Todos los derechos reservados',
  },
  localeSwitch: {
    label: 'Cambiar idioma',
  },
  home: {
    building: 'Construyéndolo... por favor espera',
    wireTag: '[ Hero · Sobre mí ]',
    wireCta: '[ CTA ]',
    tag: 'Product Engineer · UX',
    title: 'Mike Diaz',
    intro: 'Creador de productos digitales con enfoque de Experiencia de Usuario y profundidad técnica, acelerados por IA.',
    cta: 'Hablemos',
    imageAlt: 'Imagen de ejemplo',
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
    readMore: 'Ver todos los proyectos',
    items: {
      yuuka: { title: 'Yuuka Agent', description: 'Agente de IA en un chat de WhatsApp que organiza tu agenda, eventos de calendario y tareas, conectado a las APIs de Google y Meta.' },
      antSystem: { title: 'ANT System', description: 'Método de organización para gestionar archivos y carpetas con consistencia, claridad y una estructura pensada para automatizar.' },
      fileManagement: { title: 'FileManagement', description: 'Herramienta de referencia para crear tu propio sistema de gestión de archivos, con una metodología de niveles y nomenclatura que facilita guardarlos.' },
    },
    repo: 'Repositorio',
    demo: 'Sitio en vivo',
    back: 'Volver al inicio',
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
    intro: 'Cuéntame sobre tu proyecto y respondo en 48 h.',
    fields: {
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
    },
    errors: {
      required: 'Este campo es obligatorio.',
      email: 'Ingresa un correo válido.',
      tooShort: 'El mensaje debe tener al menos 10 caracteres.',
    },
    submit: 'Enviar mensaje',
    submitting: 'Enviando...',
    success: 'Mensaje enviado. ¡Gracias!',
    failure: 'Algo salió mal. Inténtalo de nuevo.',
  },
  notFound: {
    title: 'Página no encontrada',
    back: 'Volver al inicio',
  },
}
