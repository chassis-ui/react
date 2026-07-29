import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { withCustomConfig } from 'react-docgen-typescript'
import * as ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const COMPONENTS_DIR = path.resolve(__dirname, '../packages/react/src/components')
const OUTPUT_DIR = path.resolve(__dirname, '../packages/site/content/api')
const TSCONFIG_PATH = path.resolve(__dirname, '../packages/react/tsconfig.json')

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

// Data-driven components (e.g. `<CxList items={...} />`) accept an array of a plain "item
// definition" interface (CxListItemDef, CxAvatarStackItem, ...) rather than JSX children.
// react-docgen-typescript only extracts docs for component props, not for arbitrary
// interfaces, so those item shapes are parsed separately below via the TS compiler API and
// written out in the same ComponentDoc-like shape so <PropTable> can render them unchanged.
interface ItemDefDoc {
  tags: Record<string, unknown>
  filePath: string
  description: string
  displayName: string
  methods: unknown[]
  props: Record<
    string,
    {
      name: string
      required: boolean
      description: string
      defaultValue: null
      type: { name: string }
    }
  >
}

function loadCompilerOptions(tsconfigPath: string): ts.CompilerOptions {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(tsconfigPath))
  return parsed.options
}

// Mirrors the `shouldRemoveUndefinedFromOptional` react-docgen-typescript option used above,
// so optional item-def props render the same way as optional component props.
function removeUndefinedFromOptional(typeName: string): string {
  return typeName
    .split(' | ')
    .filter((part) => part !== 'undefined')
    .join(' | ')
}

function extractInterfaceDoc(name: string, program: ts.Program, checker: ts.TypeChecker): ItemDefDoc | null {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || !sourceFile.fileName.startsWith(COMPONENTS_DIR)) continue

    let found: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | undefined
    ts.forEachChild(sourceFile, (node) => {
      if (found) return
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return
      const isExported = !!ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      if (isExported && node.name.text === name) {
        found = node
      }
    })
    if (!found) continue

    const type = checker.getTypeAtLocation(found)
    const props: ItemDefDoc['props'] = {}
    for (const symbol of type.getProperties()) {
      const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
      if (!declaration) continue
      const propType = checker.getTypeOfSymbolAtLocation(symbol, declaration)
      props[symbol.name] = {
        name: symbol.name,
        required: !(symbol.flags & ts.SymbolFlags.Optional),
        description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
        defaultValue: null,
        type: { name: removeUndefinedFromOptional(checker.typeToString(propType)) }
      }
    }

    return {
      tags: {},
      filePath: sourceFile.fileName,
      description: ts.displayPartsToString(type.symbol?.getDocumentationComment(checker) ?? []),
      displayName: name,
      methods: [],
      props
    }
  }
  return null
}

function generateItemDefDocs(componentFiles: string[], componentDocs: Map<string, any>): number {
  const compilerOptions = loadCompilerOptions(TSCONFIG_PATH)
  const program = ts.createProgram(componentFiles, compilerOptions)
  const checker = program.getTypeChecker()

  const candidates = new Set<string>()
  for (const doc of componentDocs.values()) {
    for (const prop of Object.values<any>(doc.props)) {
      const match = /^([A-Za-z_$][\w$]*)\[\]$/.exec(prop.type?.name ?? '')
      if (match && match[1].startsWith('Cx') && !componentDocs.has(match[1])) {
        candidates.add(match[1])
      }
    }
  }

  let generated = 0
  for (const name of candidates) {
    const doc = extractInterfaceDoc(name, program, checker)
    if (!doc) {
      console.warn(`Skipped item definition ${name}: declaration not found`)
      continue
    }
    const outputFile = path.join(OUTPUT_DIR, `${name}.json`)
    fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2))
    console.log(`Generated: ${name}.json (item definition)`)
    generated++
  }
  return generated
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const componentFiles = findComponentFiles(COMPONENTS_DIR)
const componentDocs = new Map<string, any>()
let generated = 0

for (const file of componentFiles) {
  try {
    const docs = parser.parse(file)
    for (const doc of docs) {
      if (!doc.displayName) continue
      const outputFile = path.join(OUTPUT_DIR, `${doc.displayName}.json`)
      fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2))
      console.log(`Generated: ${doc.displayName}.json`)
      componentDocs.set(doc.displayName, doc)
      generated++
    }
  } catch (e: any) {
    console.warn(`Skipped ${path.basename(file)}: ${e.message}`)
  }
}

generated += generateItemDefDocs(componentFiles, componentDocs)

console.log(`\nDone: ${generated} API files generated in ${OUTPUT_DIR}`)
