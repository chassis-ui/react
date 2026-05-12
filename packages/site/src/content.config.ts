import { z, defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'

const docsSchema = z.object({
  added: z
    .object({
      show_badge: z.boolean().optional(),
      version: z.string()
    })
    .optional(),
  aliases: z.string().or(z.string().array()).optional(),
  description: z.string(),
  direction: z.literal('rtl').optional(),
  extra_js: z
    .object({
      async: z.boolean().optional(),
      src: z.string()
    })
    .array()
    .optional(),
  sections: z
    .object({
      description: z.string(),
      title: z.string(),
      slug: z.string().optional()
    })
    .array()
    .optional(),
  thumbnail: z.string().optional(),
  title: z.string(),
  toc: z.boolean().optional()
})

const apiSchema = z.object({
  displayName: z.string(),
  description: z.string().optional(),
  props: z.record(z.object({
    name: z.string(),
    description: z.string(),
    type: z.object({ name: z.string() }),
    defaultValue: z.object({ value: z.union([z.string(), z.boolean(), z.number()]).transform(v => String(v)) }).nullable().optional(),
    required: z.boolean()
  }))
})

const apiCollection = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/api' }),
  schema: apiSchema
})

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content' }),
  schema: docsSchema.partial()
})

export const collections = {
  docs: docsCollection,
  api: apiCollection
}
