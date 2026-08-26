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
  // react-docgen-typescript's own displayName inference (computeComponentName in its parser.js)
  // has a fallback that, when a file exports more than one value with a `.displayName = '...'`
  // assignment nearby (e.g. a component alongside a same-file `XContext = createContext(...)`),
  // can misattribute one export's assignment to a totally different export — silently merging
  // e.g. Drawer.tsx's unrelated `DrawerContext` export into a doc labeled "Drawer" and discarding
  // the real one (first-registered wins). Every component here already sets its own
  // `X.displayName = 'X'` matching its export name (see CONVENTIONS.md), so resolving the name
  // directly from the exported symbol sidesteps that heuristic entirely instead of relying on it.
  componentNameResolver: (exp) => exp.getName(),
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

// Public component files are exactly the ones a folder's `index.ts` barrel wires into the
// package's public API (see packages/react/CONVENTIONS.md) — value imports feeding a compound
// family's `Object.assign` (`import { X } from './Y'`) or a flat re-export (`export { X } from
// './Y'`). Deliberately excludes `export type { ... } from './Y'` lines: those point at
// data-shape types (`DateRangePreset`, item-def interfaces), not components, and are picked up
// separately by `generateItemDefDocs` below. This replaces the old `Cx`-filename-prefix filter,
// which stopped matching anything once the migration to unprefixed names/barrels landed.
const VALUE_IMPORT_LINE = /^(?:import|export)\s*\{[^}]*\}\s*from\s*'\.\/([A-Za-z0-9_]+)'/

function findComponentFiles(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const folderPath = path.join(dir, entry.name)
    const indexPath = path.join(folderPath, 'index.ts')
    if (!fs.existsSync(indexPath)) continue

    const fileNames = new Set<string>()
    for (const line of fs.readFileSync(indexPath, 'utf8').split('\n')) {
      const match = VALUE_IMPORT_LINE.exec(line.trim())
      if (match) fileNames.add(match[1])
    }
    for (const fileName of fileNames) {
      const tsxPath = path.join(folderPath, `${fileName}.tsx`)
      if (fs.existsSync(tsxPath)) results.push(tsxPath)
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
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  )
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

function extractInterfaceDoc(
  name: string,
  program: ts.Program,
  checker: ts.TypeChecker
): ItemDefDoc | null {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || !sourceFile.fileName.startsWith(COMPONENTS_DIR)) continue

    let found: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | undefined
    ts.forEachChild(sourceFile, (node) => {
      if (found) return
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return
      const isExported = !!ts
        .getModifiers(node)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
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

  // Every exported interface/type alias declared anywhere under COMPONENTS_DIR (including files
  // pulled in only transitively, e.g. `dateRangePresets.ts`) — used below to tell a real
  // component-owned data-shape type (`SelectOptionDef`, `DateRangePreset`, ...) apart from an
  // array-typed prop of some unrelated type (`string[]`, `ReactNode[]`, ...). Replaces the old
  // `Cx`-prefix check, which stopped matching anything once names dropped that prefix.
  const declaredTypeNames = new Set<string>()
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || !sourceFile.fileName.startsWith(COMPONENTS_DIR)) continue
    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return
      if (ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        declaredTypeNames.add(node.name.text)
      }
    })
  }

  const candidates = new Set<string>()
  for (const doc of componentDocs.values()) {
    for (const prop of Object.values<any>(doc.props)) {
      // Split on union members so a prop typed e.g. `SelectOptionDef[] | string[]` still
      // surfaces its "Def" array member as a candidate, not just a prop typed as a bare array.
      const parts = (prop.type?.name ?? '').split(' | ')
      for (const part of parts) {
        const match = /^([A-Za-z_$][\w$]*)\[\]$/.exec(part.trim())
        if (match && declaredTypeNames.has(match[1]) && !componentDocs.has(match[1])) {
          candidates.add(match[1])
        }
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
  // The file's own barrel-matched name (see findComponentFiles) is the only display name this
  // file is allowed to produce a doc for. react-docgen-typescript's auto-discovery documents
  // every plausible export it finds in the file — e.g. a same-file `XContext = createContext(...)`
  // alongside the real component — so without this filter, a component whose file also exports a
  // context (Drawer, Menu, Modal, ...) would spam an extra, spurious `XContext.json`.
  const expectedName = path.basename(file, '.tsx')
  try {
    const docs = parser.parse(file)
    for (const doc of docs) {
      if (!doc.displayName || doc.displayName !== expectedName) continue
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
