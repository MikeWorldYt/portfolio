import { useLocale } from '../../i18n/useLocale.ts'
import type { ProjectKey } from '../../data/projects.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

export function ProjectCard({ project }: { project: ProjectKey }) {
  const { t } = useLocale()
  const { title, description } = t.projects.items[project]

  return (
    <article className="rounded-xl border border-gray-200 p-4 shadow-sm">
      <ImagePlaceholder label={t.home.imageAlt} className="mb-3 aspect-[16/10]" />
      <h3 className="font-semibold">{title}</h3>
      <p>{description}</p>
    </article>
  )
}
