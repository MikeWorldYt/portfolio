export const skills = [
  'architecture',
  'productDesign',
  'prototyping',
  'accessibility',
  'apis',
  'automations',
  'aiAgents',
  'llmIntegrations',
] as const

export type SkillKey = (typeof skills)[number]
