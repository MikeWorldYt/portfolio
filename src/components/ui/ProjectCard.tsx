import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import type { ProjectData } from '../../data/projects.ts'
import { useLocale } from '../../i18n/useLocale.ts'
import { Icon } from './Icon.tsx'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

const linkClass =
  'inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 in-data-[theme=dark]:text-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2'

export function ProjectCard({ project }: { project: ProjectData }) {
  const { t } = useLocale()
  const { title, description } = t.projects.items[project.id]

  return (
    <article className="fx flex h-full flex-col p-4">
      <ImagePlaceholder label={t.home.imageAlt} className="mb-3 aspect-[16/10]" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mb-3">{description}</p>
      <ul className="mb-3 flex flex-wrap gap-1.5 text-xs">
        {project.tags.map((tag) => (
          <li key={tag} className="fx px-2 py-0.5">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-4">
        <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
          <Icon icon={faGithub} />
          {t.projects.repo}
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className={linkClass}>
            <Icon icon={faArrowUpRightFromSquare} />
            {t.projects.demo}
          </a>
        )}
      </div>
    </article>
  )
}
