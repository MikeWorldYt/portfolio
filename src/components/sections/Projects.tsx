import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { projects } from '../../data/projects.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Button } from '../ui/Button.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ProjectCard } from '../ui/ProjectCard.tsx'
import { ProjectCarousel } from '../ui/ProjectCarousel.tsx'
import { Section } from '../ui/Section.tsx'

export function Projects() {
  const { t } = useLocale()

  return (
    <Section id="projects" level="hi">
      <h2 className="scroll-rise mb-2 text-3xl font-bold">{t.projects.title}</h2>
      <p className="scroll-rise mb-4">{t.projects.intro}</p>
      <div className="scroll-rise sm:hidden">
        <ProjectCarousel projects={projects} />
      </div>
      <div className="mb-6 grid gap-4 max-sm:hidden sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={project.id} style={{ animationRange: `entry ${index * 8}% cover ${18 + index * 3}%` }} className="scroll-rise">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <div className="scroll-rise">
        <Button to="/projects" variant="outline">
        {t.projects.readMore}
          <Icon icon={faArrowRight} />
        </Button>
      </div>
    </Section>
  )
}
