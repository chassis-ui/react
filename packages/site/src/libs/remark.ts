import fs from 'node:fs'
import path from 'node:path'
import type { Root } from 'mdast'
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement
} from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { getConfig } from './config'
import { getChassisDocsPath } from './path'

// [[config:foo]]
// [[config:foo.bar]]
const configRegExp = /\[\[config:(?<name>[\w.]+)\]\]/g
// [[docsref:/foo]]
// [[docsref:/foo/bar#baz]]
const docsrefRegExp = /\[\[docsref:(?<path>[\w./#-]+)\]\]/g

// A remark plugin to replace config values embedded in markdown (or MDX) files.
export const remarkCxConfig: Plugin<[], Root> = function () {
  return function remarkCxConfigPlugin(ast, file) {
    if (containsFrontmatter(file.data.astro)) {
      replaceInFrontmatter(file.data.astro.frontmatter, replaceConfigInText)
    }

    visit(
      ast,
      ['code', 'definition', 'image', 'inlineCode', 'link', 'mdxJsxFlowElement', 'text'],
      (node) => {
        switch (node.type) {
          case 'code':
          case 'inlineCode':
          case 'text': {
            node.value = replaceConfigInText(node.value)
            break
          }
          case 'image': {
            if (node.alt) {
              node.alt = replaceConfigInText(node.alt)
            }
            node.url = replaceConfigInText(node.url)
            break
          }
          case 'definition':
          case 'link': {
            node.url = replaceConfigInText(node.url)
            break
          }
          case 'mdxJsxFlowElement': {
            node.attributes = replaceConfigInAttributes(node.attributes)
            break
          }
        }
      }
    )
  }
}

// A remark plugin to add versioned docs links in markdown (or MDX) files.
export const remarkCxDocsref: Plugin<[], Root> = function () {
  return function remarkCxDocsrefPlugin(ast, file) {
    if (containsFrontmatter(file.data.astro)) {
      replaceInFrontmatter(file.data.astro.frontmatter, replaceDocsrefInText)
    }

    visit(
      ast,
      [
        'code',
        'definition',
        'image',
        'inlineCode',
        'link',
        'mdxJsxFlowElement',
        'mdxJsxTextElement',
        'text'
      ],
      (node) => {
        switch (node.type) {
          case 'code':
          case 'inlineCode':
          case 'text': {
            node.value = replaceDocsrefInText(node.value)
            break
          }
          case 'definition':
          case 'link': {
            node.url = replaceDocsrefInText(node.url)
            break
          }
          case 'mdxJsxFlowElement':
          case 'mdxJsxTextElement': {
            node.attributes = replaceDocsrefInAttributes(node.attributes)
            break
          }
        }
      }
    )
  }
}

// `<Example>` exists to render a component's JSX exactly as authored, alongside that same JSX
// as a source snippet (see `remarkCxExample` below) — it never holds prose, so nothing inside it
// should be reinterpreted as markdown. But remark still tokenizes its contents as CommonMark, so
// any line inside a JSX element's children is subject to full markdown parsing: a label on its
// own line gets paragraph-wrapped, a line starting with `#`/`-`/`>` becomes a heading/list/
// blockquote, and inline runs of `*text*`, `` `code` ``, `[text](url)`, entities, etc. get
// converted to emphasis/inlineCode/link/decoded-text nodes.
//
// Block wrappers (paragraph, heading, blockquote, list, listItem) are purely additive — their
// inner content is unaffected, so `flattenBlockNodes` just recurses into their children and
// splices them into place. That alone also surfaces any JSX element nested inside one of them
// (e.g. `<Button>Profile <Badge>4</Badge></Button>` parses as a single `paragraph`
// wrapping `[text, Badge]` — flattening exposes that `Badge` as a sibling again instead of
// leaving it buried inside the paragraph).
//
// Inline constructs are different: they actually *consume* their markdown syntax characters
// during tokenization (an `emphasis` node's children hold "text", not "*text*"), so there's no
// wrapper to remove — the original characters are simply gone from the parsed tree. The only way
// to fully undo this is to stop trusting the parsed prose nodes and substitute the literal raw
// source text instead, which is possible because `mdxJsxFlowElement`/`mdxJsxTextElement`/
// `mdxFlowExpression`/`mdxTextExpression` nodes (actual JSX tags and `{expressions}`) keep an
// accurate `position` (offset into the file) regardless of what markdown did around them. So once
// block wrappers are flattened away, any run of consecutive non-JSX/expression nodes is collapsed
// into a single text node sliced verbatim from the raw source between that run's start and end
// offsets — reproducing the author's literal text, asterisks/backticks/entities and all — while
// actual JSX/expression children are left untouched (and recursed into on their own turn, since
// `visit` below descends into every element at every depth).
const BLOCK_WRAPPER_TYPES = new Set(['paragraph', 'heading', 'blockquote', 'list', 'listItem'])
const STRUCTURAL_MDX_TYPES = new Set([
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
  'mdxFlowExpression',
  'mdxTextExpression'
])

interface PositionedNode {
  type: string
  children?: PositionedNode[]
  position?: { start: { offset?: number }; end: { offset?: number } }
}

function flattenBlockNodes<T extends PositionedNode>(nodes: T[]): T[] {
  return nodes.flatMap((node) =>
    BLOCK_WRAPPER_TYPES.has(node.type) ? flattenBlockNodes((node.children ?? []) as T[]) : [node]
  )
}

function toLiteralChildren<T extends PositionedNode>(nodes: T[], raw: string): T[] {
  const flat = flattenBlockNodes(nodes)
  const result: T[] = []
  let run: T[] = []

  const flushRun = () => {
    if (run.length === 0) return
    const start = run[0].position?.start.offset
    const end = run[run.length - 1].position?.end.offset
    if (start != null && end != null) {
      result.push({ type: 'text', value: raw.slice(start, end) } as unknown as T)
    }
    run = []
  }

  for (const node of flat) {
    if (STRUCTURAL_MDX_TYPES.has(node.type)) {
      flushRun()
      result.push(node)
    } else {
      run.push(node)
    }
  }
  flushRun()

  return result
}

export const remarkCxExampleInlineChildren: Plugin<[], Root> = function () {
  return function remarkCxExampleInlineChildrenPlugin(ast, file) {
    const raw = String(file.value)

    visit(ast, 'mdxJsxFlowElement', (exampleNode) => {
      if (exampleNode.name !== 'Example') return

      visit(exampleNode, ['mdxJsxFlowElement', 'mdxJsxTextElement'] as const, (node) => {
        if (node === exampleNode) return
        node.children = toLiteralChildren(
          node.children as PositionedNode[],
          raw
        ) as typeof node.children
      })
    })
  }
}

interface ExampleImportBinding {
  localName: string
  source: string
}

// A remark plugin that auto-derives the source code shown by each `<Example>` shortcode, so
// docs authors never hand-transcribe a second copy of the JSX. The derived source is injected
// as a `code` prop directly on the `<Example>` element (rather than as a sibling markdown code
// fence) so `Example.astro` can render the preview and the code together in a single box with
// one shared toolbar, matching `@chassis-ui/docs`'s `<Example>`.
//
// - If `<Example>`'s only child is a bare reference to a `examples/**/*.tsx` component
//   (e.g. `<BasicUsageExample client:load />`), the derived source is that component file's
//   content, verbatim (imports, exports, everything — nothing is stripped).
// - Otherwise, the derived source is the literal JSX written between `<Example>` and
//   `</Example>`, sliced directly from the MDX source so it can never drift from what's
//   actually rendered.
// - A `customMarkup` prop, handled entirely by `Example.astro`, overrides the displayed
//   source (e.g. to abbreviate large data literals) while the real children still render live.
export const remarkCxExample: Plugin<[], Root> = function () {
  return function remarkCxExamplePlugin(ast, file) {
    const raw = String(file.value)
    const imports = collectExampleImportBindings(ast)
    const dirname = typeof file.dirname === 'string' ? file.dirname : undefined

    visit(ast, 'mdxJsxFlowElement', (node) => {
      if (node.name !== 'Example') return

      const hasCodeAttribute = node.attributes.some(
        (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'code'
      )
      if (hasCodeAttribute) return

      const source = extractExampleSource(node, raw, imports, dirname)
      if (source == null) return

      node.attributes.push({ type: 'mdxJsxAttribute', name: 'code', value: source })
    })
  }
}

function collectExampleImportBindings(ast: Root): ExampleImportBinding[] {
  const bindings: ExampleImportBinding[] = []

  for (const child of ast.children) {
    const node = child as { type: string; data?: unknown }
    if (node.type !== 'mdxjsEsm') continue

    const program = (node.data as { estree?: { body: unknown[] } } | undefined)?.estree
    if (!program) continue

    for (const statement of program.body as Array<{
      type: string
      specifiers?: Array<{ type: string; local: { name: string } }>
      source?: { value: string }
    }>) {
      if (statement.type !== 'ImportDeclaration' || !statement.source) continue

      for (const specifier of statement.specifiers ?? []) {
        if (specifier.type !== 'ImportSpecifier' && specifier.type !== 'ImportDefaultSpecifier') {
          continue
        }
        bindings.push({ localName: specifier.local.name, source: statement.source.value })
      }
    }
  }

  return bindings
}

function extractExampleSource(
  node: MdxJsxFlowElement,
  raw: string,
  imports: ExampleImportBinding[],
  dirname: string | undefined
): string | undefined {
  if (node.children.length === 1) {
    const child = node.children[0]

    if (child.type === 'mdxJsxFlowElement' && child.children.length === 0 && child.name) {
      const binding = imports.find((importBinding) => importBinding.localName === child.name)

      if (
        binding &&
        dirname &&
        (binding.source.startsWith('.') || binding.source.startsWith('/'))
      ) {
        const resolved = resolveExampleComponentSource(binding.source, dirname)
        if (resolved != null) return resolved
      }
    }
  }

  return sliceExampleChildrenSource(node, raw)
}

function sliceExampleChildrenSource(node: MdxJsxFlowElement, raw: string): string | undefined {
  const first = node.children[0]
  const last = node.children[node.children.length - 1]

  if (!first?.position || !last?.position) return undefined

  return dedentInlineSlice(raw.slice(first.position.start.offset, last.position.end.offset))
}

// Reads a `examples/**/*.tsx` component file and returns its content verbatim — imports,
// exports, and all — so the docs always show exactly what's on disk.
function resolveExampleComponentSource(importPath: string, dirname: string): string | undefined {
  const filePath = path.resolve(dirname, importPath)
  if (!fs.existsSync(filePath)) return undefined

  return fs.readFileSync(filePath, 'utf8').trim()
}

// Dedents a slice taken from MDX source, where the first line has already had its
// indentation consumed by the slice's start offset and so is excluded from the calculation.
function dedentInlineSlice(text: string): string {
  const lines = text.split('\n')
  if (lines.length <= 1) return text.trim()

  const [firstLine, ...rest] = lines
  const minIndent = minimumIndent(rest)

  return [firstLine, ...rest.map((line) => line.slice(minIndent))].join('\n').replace(/\s+$/, '')
}

function minimumIndent(lines: string[]) {
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0)

  return indents.length ? Math.min(...indents) : 0
}

export function replaceConfigInText(text: string) {
  return text.replace(configRegExp, (_match, path) => {
    const value = getConfigValueAtPath(path)

    if (!value) {
      throw new Error(`Failed to find a valid configuration value for '${path}'.`)
    }

    return value
  })
}

function replaceConfigInAttributes(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  return attributes.map((attribute) => {
    if (attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string') {
      attribute.value = replaceConfigInText(attribute.value)
    }
    return attribute
  })
}

export function replaceDocsrefInText(text: string) {
  return text.replace(docsrefRegExp, (_match, path) => {
    return getChassisDocsPath(path)
  })
}

function replaceDocsrefInAttributes(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  return attributes.map((attribute) => {
    if (attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string') {
      attribute.value = replaceDocsrefInText(attribute.value)
    }
    return attribute
  })
}

function getConfigValueAtPath(path: string) {
  const config = getConfig()

  const value = path.split('.').reduce((values, part) => {
    if (!values || typeof values !== 'object') {
      return undefined
    }
    return (values as Record<string, unknown>)?.[part]
  }, config as unknown)

  return typeof value === 'string' ? value : undefined
}

function replaceInFrontmatter(
  record: Record<string, unknown>,
  replacer: (value: string) => string
) {
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') {
      record[key] = replacer(value)
    } else if (Array.isArray(value)) {
      record[key] = value.map((arrayValue) => {
        return typeof arrayValue === 'string'
          ? replacer(arrayValue)
          : typeof arrayValue === 'object'
            ? replaceInFrontmatter(arrayValue, replacer)
            : arrayValue
      })
    }
  }
  return record
}

function containsFrontmatter(data: unknown): data is { frontmatter: Record<string, unknown> } {
  return data != undefined && typeof data === 'object' && 'frontmatter' in data
}
