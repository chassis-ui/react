import Prism, { type hooks } from 'prismjs'
const { Token } = Prism

let isPrismConfigured = false

export function configurePrism() {
  if (isPrismConfigured) {
    return
  }

  isPrismConfigured = true

  Prism.hooks.add('after-tokenize', lineWrapPlugin)
}

// A plugin to wrap each line in a .line span, except for comments and empty lines.
function lineWrapPlugin(env: hooks.HookEnvironmentMap['after-tokenize']) {
  if (env.language !== 'bash' && env.language !== 'sh' && env.language !== 'powershell') {
    return
  }

  const lines: (string | Prism.Token)[][] = [[]]

  for (let i = 0; i < env.tokens.length; i++) {
    const token = env.tokens[i]

    if (typeof token === 'string') {
      const parts = token.split('\n')

      for (let j = 0; j < parts.length; j++) {
        if (j > 0) {
          lines.push([])
        }
        if (parts[j]) {
          lines[lines.length - 1].push(parts[j])
        }
      }
    } else {
      lines[lines.length - 1].push(token)
    }
  }

  env.tokens = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const isEmptyLine =
      line.length === 0 ||
      (line.length === 1 && typeof line[0] === 'string' && line[0].trim() === '')

    const isCommentLine = line.every((token) => {
      if (typeof token === 'string') {
        return token.trim() === ''
      }
      return token.type === 'comment'
    })

    if (isEmptyLine || isCommentLine) {
      env.tokens.push(...line)
      if (i < lines.length - 1) {
        env.tokens.push('\n')
      }
    } else {
      const lineToken = new Token('span', '', ['line'])
      const lineChildren: (string | Prism.Token)[] = []

      lineChildren.push(...line)

      if (i < lines.length - 1) {
        lineChildren.push('\n')
      }

      lineToken.content = lineChildren
      env.tokens.push(lineToken)
    }
  }
}
