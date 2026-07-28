import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAvatar, CxAvatarStack } from '../../../index'

describe('CxAvatarStack', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      const { container } = render(
        <CxAvatarStack>
          <CxAvatar>CX</CxAvatar>
        </CxAvatarStack>
      )
      expect(container.firstChild).toHaveClass('avatar-stack')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxAvatarStack>
          <CxAvatar>CX</CxAvatar>
        </CxAvatarStack>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies the size and caller className together', () => {
      const { container } = render(
        <CxAvatarStack className="bazinga" size="small">
          <CxAvatar>CX</CxAvatar>
        </CxAvatarStack>
      )
      expect(container.firstChild).toHaveClass('avatar-stack', 'small', 'bazinga')
    })
  })

  describe('data', () => {
    test('renders a CxAvatar for each data item', () => {
      render(
        <CxAvatarStack
          data={[
            { src: 'https://placehold.co/256x256', alt: 'Ada', status: 'success' },
            { src: 'https://placehold.co/256x256', alt: 'Grace' }
          ]}
        />
      )
      expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Grace' })).toBeInTheDocument()
      expect(document.querySelector('.badge.success')).toBeInTheDocument()
    })

    test('renders data items ahead of any JSX children', () => {
      render(
        <CxAvatarStack data={[{ content: 'CX' }]}>
          <CxAvatar>+5</CxAvatar>
        </CxAvatarStack>
      )
      const avatars = screen.getAllByRole('button')
      expect(avatars.map((el) => el.textContent)).toEqual(['CX', '+5'])
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <CxAvatarStack ref={ref}>
          <CxAvatar>CX</CxAvatar>
        </CxAvatarStack>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxAvatarStack>
          <CxAvatar>CX</CxAvatar>
          <CxAvatar>+5</CxAvatar>
        </CxAvatarStack>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
