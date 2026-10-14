import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from '../../src/components/avatar/Avatar'
import { AvatarStack } from '../../src/components/avatar/AvatarStack'
import { Badge } from '../../src/components/badge/Badge'
import { Button } from '../../src/components/button/Button'
import { ButtonGroup } from '../../src/components/button-group/ButtonGroup'
import { ButtonToolbar } from '../../src/components/button-group/ButtonToolbar'
import { Chip } from '../../src/components/chip/Chip'
import { CloseButton } from '../../src/components/close-button/CloseButton'
import { Link } from '../../src/components/link/Link'
import { Skeleton } from '../../src/components/skeleton/Skeleton'
import { Spinner } from '../../src/components/spinner/Spinner'
import type { ContextColor } from '../../src/types'

// One page of the buttons, links and small status components in their main states, for a single
// visual regression screenshot (`test/visual/overview-actions-and-feedback.visual.spec.ts`). None
// of these components has styles of its own: they apply `@chassis-ui/css` classes, so what can
// move them is a change to chassis-css, and one screenshot of all of them side by side catches it
// (#45). A component that gains styles or runtime layout of its own gets a per-story spec instead,
// as `Alert`, a modal dialog, has.
//
// The page has a fixed width, so the screenshot doesn't depend on the viewport, and no story-level
// state: every value is a default, nothing takes focus. Spinners and skeletons animate forever;
// the screenshot cancels infinite animations, which leaves each at its first frame. The avatar
// image is inline, so the page loads nothing from the network.
const meta: Meta = {
  title: 'overview/Actions and feedback',
  tags: ['!autodocs']
}

export default meta

type Story = StoryObj

const PAGE: React.CSSProperties = {
  display: 'grid',
  gap: '2rem 3rem',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'start',
  width: 960
}

const STACK: React.CSSProperties = { display: 'grid', gap: '1rem' }

const ROW: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
}

function Section({
  title,
  children,
  wide
}: {
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section style={wide ? { ...STACK, gridColumn: '1 / -1' } : STACK}>
      <h2 className="h6 mb-0">{title}</h2>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={ROW}>{children}</div>
}

const COLORS: ContextColor[] = [
  'default',
  'primary',
  'secondary',
  'neutral',
  'success',
  'danger',
  'warning',
  'info',
  'black'
]

const PORTRAIT =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#6f42c1"/>' +
      '<circle cx="32" cy="26" r="12" fill="#e9d8fd"/>' +
      '<rect x="12" y="44" width="40" height="24" rx="12" fill="#e9d8fd"/>' +
      '</svg>'
  )

export const Default: Story = {
  render: () => (
    <div style={PAGE}>
      <Section title="Button" wide>
        <Row>
          {COLORS.map((color) => (
            <Button key={color} color={color}>
              {color}
            </Button>
          ))}
        </Row>
        {(['outline', 'smooth', 'basic'] as const).map((variant) => (
          <Row key={variant}>
            {COLORS.map((color) => (
              <Button key={color} color={color} variant={variant}>
                {variant}
              </Button>
            ))}
          </Row>
        ))}
        <Row>
          <Button color="primary" size="sm">
            Small
          </Button>
          <Button color="primary">Default</Button>
          <Button color="primary" size="lg">
            Large
          </Button>
          <Button color="primary" disabled>
            Disabled
          </Button>
          <Button color="primary" variant="outline" disabled>
            Disabled outline
          </Button>
          <Button variant="link">Link button</Button>
        </Row>
      </Section>

      <Section title="ButtonGroup">
        <Row>
          <ButtonGroup aria-label="Solid group">
            <Button color="primary">Left</Button>
            <Button color="primary">Middle</Button>
            <Button color="primary">Right</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Outlined group">
            <Button color="primary" variant="outline">
              Left
            </Button>
            <Button color="primary" variant="outline">
              Middle
            </Button>
            <Button color="primary" variant="outline">
              Right
            </Button>
          </ButtonGroup>
        </Row>
        <Row>
          <ButtonGroup size="sm" aria-label="Small group">
            <Button variant="outline">Small</Button>
            <Button variant="outline">Group</Button>
          </ButtonGroup>
          <ButtonGroup size="lg" aria-label="Large group">
            <Button variant="outline">Large</Button>
            <Button variant="outline">Group</Button>
          </ButtonGroup>
        </Row>
        <Row>
          <ButtonGroup vertical aria-label="Vertical group">
            <Button color="black">Top</Button>
            <Button color="black">Middle</Button>
            <Button color="black">Bottom</Button>
          </ButtonGroup>
          <ButtonToolbar aria-label="Toolbar">
            <ButtonGroup className="me-sm" aria-label="First group">
              <Button color="primary">1</Button>
              <Button color="primary">2</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Second group">
              <Button color="secondary">3</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Row>
      </Section>

      <Section title="CloseButton and Link">
        <Row>
          <CloseButton size="sm" />
          <CloseButton />
          <CloseButton size="lg" />
          <CloseButton disabled />
        </Row>
        <div className="neutral-bg-evident d-inline-flex p-xs gap-sm" style={{ width: 'auto' }}>
          <CloseButton color="primary" />
          <CloseButton color="primary" variant="solid" />
          <CloseButton color="warning" />
          <CloseButton color="warning" variant="solid" />
        </div>
        <Row>
          <Link href="#">Default link</Link>
          <Link href="#" color="primary">
            Primary
          </Link>
          <Link href="#" color="danger">
            Danger
          </Link>
          <Link href="#" color="success">
            Success
          </Link>
          <Link href="#" active>
            Current page
          </Link>
          <Link href="#" disabled>
            Disabled
          </Link>
          {/* No `component="button"` link: it gets no class, and chassis-css styles a bare
              `<button>` as the browser's own, not as a link. */}
        </Row>
      </Section>

      <Section title="Badge">
        <Row>
          {COLORS.map((color) => (
            <Badge key={color} color={color}>
              {color}
            </Badge>
          ))}
        </Row>
        <Row>
          {(['outline', 'smooth'] as const).map((variant) =>
            (['primary', 'danger', 'success'] as const).map((color) => (
              <Badge key={`${variant}-${color}`} color={color} variant={variant}>
                {variant}
              </Badge>
            ))
          )}
        </Row>
        <Row>
          <Badge color="primary" size="sm">
            Small
          </Badge>
          <Badge color="primary" size="lg">
            Large
          </Badge>
          <Button color="primary">
            Notifications <Badge color="secondary">4</Badge>
          </Button>
          <Button color="primary" className="position-relative">
            Profile
            <Badge color="danger" position="top-end" circle>
              99+
            </Badge>
          </Button>
        </Row>
      </Section>

      <Section title="Chip">
        <Row>
          {COLORS.map((color) => (
            <Chip key={color} color={color}>
              {color}
            </Chip>
          ))}
        </Row>
        <Row>
          {(['outline', 'smooth'] as const).map((variant) =>
            (['primary', 'danger'] as const).map((color) => (
              <Chip key={`${variant}-${color}`} color={color} variant={variant}>
                {variant}
              </Chip>
            ))
          )}
          <Chip color="primary" size="sm">
            Small
          </Chip>
          <Chip color="primary" size="lg">
            Large
          </Chip>
        </Row>
        <Row>
          <Chip color="primary">
            Dismissible
            <CloseButton label="Remove" />
          </Chip>
          <Chip component="button" color="primary" pressed>
            Pressed
          </Chip>
          <Chip component="button" color="primary" disabled>
            Disabled
          </Chip>
        </Row>
      </Section>

      <Section title="Avatar">
        <Row>
          {(['default', 'primary', 'secondary', 'danger', 'success'] as const).map((color) => (
            <Avatar key={color} color={color}>
              CX
            </Avatar>
          ))}
          <Avatar src={PORTRAIT} alt="Portrait" />
        </Row>
        <Row>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Avatar key={size} size={size}>
              CX
            </Avatar>
          ))}
        </Row>
        <Row>
          <Avatar status="success" statusLabel="Online">
            ON
          </Avatar>
          <Avatar status="danger" statusLabel="Offline">
            OF
          </Avatar>
          <Avatar status="warning" statusLabel="Away">
            AW
          </Avatar>
          <AvatarStack items={[{ content: 'AB' }, { content: 'CD' }, { content: 'EF' }]}>
            <Avatar component="span">+5</Avatar>
          </AvatarStack>
        </Row>
      </Section>

      <Section title="Spinner and Skeleton">
        {/* No `grow` spinner: its first frame, where the screenshot leaves it, is fully transparent. */}
        <Row>
          <Spinner />
          {(['primary', 'success', 'danger'] as const).map((color) => (
            <Spinner key={color} color={color} visuallyHiddenLabel={`Loading, ${color}`} />
          ))}
          <Spinner size="sm" />
          <Button disabled>
            <Spinner component="span" size="sm" aria-hidden="true" />
            Loading...
          </Button>
        </Row>
        <div style={STACK} aria-hidden="true">
          <Skeleton span={12} />
          <p className="mb-0">
            <Skeleton span={7} /> <Skeleton span={4} /> <Skeleton span={4} />
          </p>
          <Skeleton color="primary" span={12} />
          <Skeleton color="danger" span={6} />
          <Skeleton component="p" animation="glow" className="w-100 mb-0">
            <Skeleton span={12} />
          </Skeleton>
          <div className="d-flex align-items-center gap-md">
            <Skeleton component={Avatar} size="lg" />
            <Skeleton component={Button} span={3} disabled />
          </div>
        </div>
      </Section>
    </div>
  )
}
