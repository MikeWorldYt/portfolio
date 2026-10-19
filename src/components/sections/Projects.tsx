import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { projects } from '../../data/projects.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ProjectCard } from '../ui/ProjectCard.tsx'
import { ProjectCarousel } from '../ui/ProjectCarousel.tsx'
import { Reveal } from '../ui/Reveal.tsx'
import { Section } from '../ui/Section.tsx'

export function Projects() {
  const { t } = useLocale()

  return (
    <Section id="projects" level="hi">
      <h2 className="mb-2 text-3xl font-bold">{t.projects.title}</h2>
      <p className="mb-4">{t.projects.intro}</p>
      <div className="sm:hidden">
        <ProjectCarousel projects={projects} />
      </div>
      <div className="mb-6 grid gap-4 max-sm:hidden sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 120}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
      <Button to="/projects" variant="outline">
        {t.projects.readMore}
        <Icon icon={faArrowRight} />
      </Button>
    </Section>
  )
}
