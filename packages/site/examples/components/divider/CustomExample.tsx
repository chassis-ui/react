import type { CSSProperties } from 'react'
import { Divider } from '@chassis-ui/react'

const primary = {
  '--cx-divider-color': 'var(--cx-primary)',
  '--cx-divider-size': 'var(--cx-border-width-xl)',
  '--cx-divider-label-fg-color': 'var(--cx-primary)'
} as CSSProperties

export const Example = () => (
  <>
    <Divider className="my-xl" />
    <Divider style={primary}>New messages</Divider>
  </>
)
