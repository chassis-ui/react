import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { withCustomConfig } from 'react-docgen-typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const COMPONENTS_DIR = path.resolve(__dirname, '../packages/react/src/components')
const OUTPUT_DIR = path.resolve(__dirname, '../packages/site/content/api')

const parser = withCustomConfig(path.resolve(__dirname, '../packages/react/tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (prop.parent) {
      if (
        /node_modules\/(react-aria|react-stately|@react-aria|@react-stately|@react-types|@internationalized)\//.test(
          prop.parent.fileName
        )
      )
        return true
      return !prop.parent.fileName.includes('node_modules')
    }
    return true
  }
})

function findComponentFiles(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findComponentFiles(fullPath))
    } else if (
      entry.isFile() &&
      entry.name.startsWith('Cx') &&
      entry.name.endsWith('.tsx') &&
      !entry.name.includes('spec') &&
      !entry.name.includes('test')
    ) {
      results.push(fullPath)
    }
  }
  return results
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const componentFiles = findComponentFiles(COMPONENTS_DIR)
let generated = 0

for (const file of componentFiles) {
  try {
    const docs = parser.parse(file)
    for (const doc of docs) {
      if (!doc.displayName) continue
      const outputFile = path.join(OUTPUT_DIR, `${doc.displayName}.json`)
      fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2))
      console.log(`Generated: ${doc.displayName}.json`)
      generated++
    }
  } catch (e: any) {
    console.warn(`Skipped ${path.basename(file)}: ${e.message}`)
  }
}

console.log(`\nDone: ${generated} API files generated in ${OUTPUT_DIR}`)
