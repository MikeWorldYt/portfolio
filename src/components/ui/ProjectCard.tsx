import { useLocale } from '../../i18n/useLocale.ts'
import type { ProjectKey } from '../../data/projects.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

export function ProjectCard({ project }: { project: ProjectKey }) {
  const { t } = useLocale()
  const { title, description } = t.projects.items[project]

  return (
    <article className="fx p-4">
      <ImagePlaceholder label={t.home.imageAlt} className="mb-3 aspect-[16/10]" />
      <h3 className="font-semibold">{title}</h3>
      <p>{description}</p>
    </article>
  )
}
