import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router'
import { Fidelity } from '../components/ui/Fidelity.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { ProjectCard } from '../components/ui/ProjectCard.tsx'
import { Reveal } from '../components/ui/Reveal.tsx'
import { projects } from '../data/projects.ts'
import { useLocale } from '../i18n/useLocale.ts'

export function ProjectsPage() {
  const { t } = useLocale()

  return (
    <Fidelity level="hi" className="mx-auto max-w-4xl py-8">
      <Link
        to={{ pathname: '/', hash: '#projects' }}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 in-data-[theme=dark]:text-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Icon icon={faArrowLeft} />
        {t.projects.back}
      </Link>
      <h1 className="mb-2 text-4xl font-bold">{t.projects.title}</h1>
      <p className="mb-6">{t.projects.intro}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 120}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Fidelity>
  )
}
