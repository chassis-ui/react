import { z } from 'zod'
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const docsSchema = z.object({
  added: z
    .object({
      show_badge: z.boolean().optional(),
      version: z.string()
    })
    .optional(),
  aliases: z.string().or(z.string().array()).optional(),
  deps: z
    .object({
      title: z.string(),
      url: z.string().optional()
    })
    .array()
    .optional(),
  description: z.string(),
  direction: z.literal('rtl').optional(),
  extra_js: z
    .object({
      async: z.boolean().optional(),
      src: z.string()
    })
    .array()
    .optional(),
  mdn: z.string().optional(),
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
  props: z.record(
    z.string(),
    z.object({
      name: z.string(),
      description: z.string(),
      type: z.object({
        name: z.string(),
        raw: z.string().optional(),
        value: z.array(z.object({ value: z.string() })).optional()
      }),
      defaultValue: z
        .object({
          value: z.union([z.string(), z.boolean(), z.number()]).transform((v) => String(v))
        })
        .nullable()
        .optional(),
      required: z.boolean()
    })
  )
})

const calloutsCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/callouts' }),
  schema: z.looseObject({})
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
  callouts: calloutsCollection,
  docs: docsCollection,
  api: apiCollection
}
