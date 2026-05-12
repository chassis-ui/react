import { getCollection, getEntry } from 'astro:content'

export const docsPages = await getCollection('docs')

export function getCalloutByName(name: string) {
  return getEntry('callouts', name)
}

export type CalloutName = string
