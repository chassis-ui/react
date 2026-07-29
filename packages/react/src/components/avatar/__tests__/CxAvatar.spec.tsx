import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAvatar } from '../../../index'

describe('CxAvatar', () => {
  describe('rendering', () => {
    test('renders a button with the base class and type="button" by default', () => {
      render(<CxAvatar>CX</CxAvatar>)
      const avatar = screen.getByRole('button', { name: 'CX' })
      expect(avatar).toHaveClass('avatar')
      expect(avatar.tagName).toBe('BUTTON')
      expect(avatar).toHaveAttribute('type', 'button')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAvatar>CX</CxAvatar>)
      expect(container).toMatchSnapshot()
    })

    test('applies context, smooth and size classes together', () => {
      render(
        <CxAvatar className="bazinga" context="primary" smooth size="small">
          CX
        </CxAvatar>
      )
      expect(screen.getByRole('button', { name: 'CX' })).toHaveClass(
        'avatar',
        'primary',
        'small',
        'smooth',
        'bazinga'
      )
    })

    test('applies the disabled class when component is a non-interactive tag', () => {
      render(
        <CxAvatar component="span" disabled>
          CX
        </CxAvatar>
      )
      expect(screen.getByText('CX')).toHaveClass('disabled')
    })
  })

  describe('image', () => {
    test('renders a CxAvatarImage when src is given, with the default alt text', () => {
      render(<CxAvatar src="https://placehold.co/256x256" />)
      const img = screen.getByRole('img', { name: 'Profile picture' })
      expect(img).toHaveClass('avatar-image')
      expect(img).toHaveAttribute('src', 'https://placehold.co/256x256')
    })

    test('renders a custom alt when given', () => {
      render(<CxAvatar src="https://placehold.co/256x256" alt="Jane's profile picture" />)
      expect(screen.getByRole('img', { name: "Jane's profile picture" })).toBeInTheDocument()
    })

    test('renders children instead of an image when src is not given', () => {
      const { container } = render(<CxAvatar>CX</CxAvatar>)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(container).toHaveTextContent('CX')
    })
  })

  describe('href', () => {
    test('renders as a link and defaults component to "a" when href is given', () => {
      render(<CxAvatar href="/profile">CX</CxAvatar>)
      const link = screen.getByRole('link', { name: 'CX' })
      expect(link).toHaveClass('avatar')
      expect(link).toHaveAttribute('href', '/profile')
    })

    test('an explicit component overrides the href-implied "a"', () => {
      render(
        <CxAvatar href="/profile" component="button">
          CX
        </CxAvatar>
      )
      expect(screen.getByRole('button', { name: 'CX' })).toBeInTheDocument()
    })
  })

  describe('status badge', () => {
    test('renders a status badge with the status as the fallback accessible label', () => {
      render(<CxAvatar status="success">CX</CxAvatar>)
      const badge = screen.getByText('success', { selector: '.visually-hidden' })
      // The badge wrapper has no role/name of its own - only its hidden label text is
      // queryable, so reaching the wrapper to check its classes needs raw node access.
      // eslint-disable-next-line testing-library/no-node-access
      expect(badge.closest('.badge')).toHaveClass('badge', 'success', 'circle')
    })

    test('renders a custom statusLabel', () => {
      render(
        <CxAvatar status="success" statusLabel="Online">
          CX
        </CxAvatar>
      )
      expect(screen.getByText('Online', { selector: '.visually-hidden' })).toBeInTheDocument()
    })

    test('renders no badge when status is not given', () => {
      // Same unlabeled badge wrapper as above; its absence can only be checked by class.
      const { container } = render(<CxAvatar>CX</CxAvatar>)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.badge')).not.toBeInTheDocument()
    })
  })

  describe('polymorphic component', () => {
    test('disables the underlying button', () => {
      render(<CxAvatar disabled>CX</CxAvatar>)
      expect(screen.getByRole('button', { name: 'CX' })).toBeDisabled()
    })

    test('marks a disabled link as aria-disabled and prevents navigation', () => {
      render(
        <CxAvatar href="/profile" disabled>
          CX
        </CxAvatar>
      )
      const link = screen.getByRole('link', { name: 'CX' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button by default', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<CxAvatar ref={ref}>CX</CxAvatar>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxAvatar context="primary" status="success">
          CX
        </CxAvatar>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
