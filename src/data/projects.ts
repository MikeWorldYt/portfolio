export const projects = [
  {
    id: 'yuuka',
    repo: 'https://github.com/MikeWorldYt/ai-personalities',
    video: '/projects/yuuka_agent.mp4',
    tags: ['AI Agent', , 'Google Cloud', 'Meta Graph', 'Cloudflare Workers', 'TypeScript', 'Postgres'],
  },
  {
    id: 'antSystem',
    repo: 'https://github.com/MikeWorldYt/ANT-system',
    demo: 'https://ant-system.vercel.app',
    tags: ['Python'],
  },
  {
    id: 'fileManagement',
    repo: 'https://github.com/MikeWorldYt/FileManagement',
    demo: 'https://mikeworldyt.github.io/FileManagement/',
    tags: ['HTML'],
  },
] as const

type Project = (typeof projects)[number]

export type ProjectKey = Project['id']

export type ProjectData = {
  id: ProjectKey
  repo: string
  demo?: string
  video?: string
  tags: readonly string[]
}
