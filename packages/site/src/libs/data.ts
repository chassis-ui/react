import fs from 'node:fs'
import yaml from 'js-yaml'
import { z } from 'zod'

// An object containing all the data types and their associated schema. The key
// should match the name of the data file in the `./data/` directory.
const dataDefinitions = {
  sidebar: z
    .object({
      title: z.string(),
      section: z.string().optional(),
      icon: z.string().optional(),
      icon_color: z.string().optional(),
      pages: z
        .object({
          title: z.string().optional(),
          href: z.string().optional(),
          group: z.string().optional(),
          meta: z.object({ added: z.string() }).array().optional(),
          pages: z
            .object({
              title: z.string(),
              meta: z.object({ added: z.string() }).array().optional()
            })
            .array()
            .optional()
        })
        .array()
        .optional()
    })
    .array()
} satisfies Record<string, DataSchema>

export type SidebarGroup = z.infer<typeof dataDefinitions.sidebar>[number]
export type SidebarItem = NonNullable<SidebarGroup['pages']>[number]

const data = new Map<DataType, z.infer<DataSchema>>()

// A helper to get data loaded from a yml file in the `./data/` directory. If
// the data does not match its associated schema, an error is thrown.
export function getData<TType extends DataType>(
  type: TType
): z.infer<(typeof dataDefinitions)[TType]> {
  if (data.has(type)) {
    return data.get(type) as z.infer<(typeof dataDefinitions)[TType]>
  }

  const dataPath = `./data/${type}.yml`

  try {
    const rawData = yaml.load(fs.readFileSync(dataPath, 'utf8'))
    const parsedData = dataDefinitions[type].parse(rawData)
    data.set(type, parsedData)
    return parsedData as z.infer<(typeof dataDefinitions)[TType]>
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`The \`${dataPath}\` file content is invalid:`, error.issues)
    }
    throw new Error(`Failed to load data from \`${dataPath}\``, { cause: error })
  }
}

type DataType = keyof typeof dataDefinitions
type DataSchema = z.ZodTypeAny
