export const projects = ['one', 'two', 'three'] as const

export type ProjectKey = (typeof projects)[number]
