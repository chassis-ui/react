import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Avatar, AvatarStack } from '../../../src/index'

describe('AvatarStack', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      // The stack wrapper is a plain div with no role of its own - the only queryable
      // descendant is the Avatar button, not the wrapper itself.
      const { container } = render(
        <AvatarStack>
          <Avatar>CX</Avatar>
        </AvatarStack>
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('avatar-stack')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('applies the size and caller className together', () => {
      // Same unlabeled wrapper as above.
      const { container } = render(
        <AvatarStack className="bazinga" size="small">
          <Avatar>CX</Avatar>
        </AvatarStack>
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('avatar-stack', 'small', 'bazinga')
    })

    test('renders as a custom element via component', () => {
      const { container } = render(
        <AvatarStack component="ul">
          <Avatar>CX</Avatar>
        </AvatarStack>
      )

      expect(container.firstChild?.nodeName).toBe('UL')
    })
  })

  describe('data', () => {
    test('renders an Avatar for each data item', () => {
      render(
        <AvatarStack
          items={[
            { src: 'https://placehold.co/256x256', alt: 'Ada', status: 'success' },
            { src: 'https://placehold.co/256x256', alt: 'Grace' }
          ]}
        />
      )
      expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Grace' })).toBeInTheDocument()
      // The status badge has no role/name of its own - only checkable by class.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.badge.success')).toBeInTheDocument()
    })

    test('renders data items ahead of any JSX children', () => {
      const { container } = render(
        <AvatarStack items={[{ content: 'CX' }]}>
          <Avatar>+5</Avatar>
        </AvatarStack>
      )
      // The Avatar wrapper has no role/name of its own by default (see BUG-10) - only checkable
      // by class/order.
      // eslint-disable-next-line testing-library/no-node-access
      const avatars = Array.from(container.querySelectorAll('.avatar'))
      expect(avatars.map((el) => el.textContent)).toEqual(['CX', '+5'])
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <AvatarStack ref={ref}>
          <Avatar>CX</Avatar>
        </AvatarStack>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <AvatarStack>
          <Avatar>CX</Avatar>
          <Avatar>+5</Avatar>
        </AvatarStack>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
