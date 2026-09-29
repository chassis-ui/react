import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { calloutsSchema, docsSchema, z } from '@chassis-ui/docs/schema'

// The package's frontmatter, plus the keys that `PageMeta.astro` reads.
const siteDocsSchema = docsSchema.extend({
  deps: z
    .object({
      title: z.string(),
      url: z.string().optional()
    })
    .array()
    .optional(),
  mdn: z.string().optional()
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
  schema: calloutsSchema
})

const apiCollection = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/api' }),
  schema: apiSchema
})

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content' }),
  schema: siteDocsSchema
})

export const collections = {
  callouts: calloutsCollection,
  docs: docsCollection,
  api: apiCollection
}
