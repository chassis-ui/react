import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Avatar } from '../../../src/index'

describe('Avatar', () => {
  describe('rendering', () => {
    test('renders a non-interactive span with the base class by default', () => {
      render(<Avatar>CX</Avatar>)
      const avatar = screen.getByText('CX')
      expect(avatar).toHaveClass('avatar')
      expect(avatar.tagName).toBe('SPAN')
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('applies color, smooth and size classes together', () => {
      render(
        <Avatar className="bazinga" color="primary" smooth size="small">
          CX
        </Avatar>
      )
      expect(screen.getByText('CX')).toHaveClass('avatar', 'primary', 'small', 'smooth', 'bazinga')
    })

    test('applies the disabled class when component is a non-interactive tag', () => {
      render(
        <Avatar component="span" disabled>
          CX
        </Avatar>
      )
      expect(screen.getByText('CX')).toHaveClass('disabled')
    })
  })

  describe('image', () => {
    test('renders a AvatarImage when src is given, with the default alt text', () => {
      render(<Avatar src="https://placehold.co/256x256" />)
      const img = screen.getByRole('img', { name: 'Profile picture' })
      expect(img).toHaveClass('avatar-image')
      expect(img).toHaveAttribute('src', 'https://placehold.co/256x256')
    })

    test('renders a custom alt when given', () => {
      render(<Avatar src="https://placehold.co/256x256" alt="Jane's profile picture" />)
      expect(screen.getByRole('img', { name: "Jane's profile picture" })).toBeInTheDocument()
    })

    test('renders children instead of an image when src is not given', () => {
      const { container } = render(<Avatar>CX</Avatar>)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(container).toHaveTextContent('CX')
    })
  })

  describe('href', () => {
    test('renders as a link and defaults component to "a" when href is given', () => {
      render(<Avatar href="/profile">CX</Avatar>)
      const link = screen.getByRole('link', { name: 'CX' })
      expect(link).toHaveClass('avatar')
      expect(link).toHaveAttribute('href', '/profile')
    })

    test('an explicit component overrides the href-implied "a"', () => {
      render(
        <Avatar href="/profile" component="button">
          CX
        </Avatar>
      )
      expect(screen.getByRole('button', { name: 'CX' })).toBeInTheDocument()
    })

    test('forwards href to a custom component reference, not just the native "a"/"button" strings', () => {
      const CustomLink = React.forwardRef<
        HTMLAnchorElement,
        React.AnchorHTMLAttributes<HTMLAnchorElement>
      >((props, ref) => <a ref={ref} {...props} />)

      render(
        <Avatar component={CustomLink} href="/profile">
          CX
        </Avatar>
      )
      expect(screen.getByRole('link', { name: 'CX' })).toHaveAttribute('href', '/profile')
    })
  })

  describe('status badge', () => {
    test('renders a status badge with the status as the fallback accessible label', () => {
      render(<Avatar status="success">CX</Avatar>)
      const badge = screen.getByText('success', { selector: '.visually-hidden' })
      // The badge wrapper has no role/name of its own - only its hidden label text is
      // queryable, so reaching the wrapper to check its classes needs raw node access.
      // eslint-disable-next-line testing-library/no-node-access
      expect(badge.closest('.badge')).toHaveClass('badge', 'success', 'circle')
    })

    test('renders a custom statusLabel', () => {
      render(
        <Avatar status="success" statusLabel="Online">
          CX
        </Avatar>
      )
      expect(screen.getByText('Online', { selector: '.visually-hidden' })).toBeInTheDocument()
    })

    test('renders no badge when status is not given', () => {
      // Same unlabeled badge wrapper as above; its absence can only be checked by class.
      const { container } = render(<Avatar>CX</Avatar>)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.badge')).not.toBeInTheDocument()
    })
  })

  describe('polymorphic component', () => {
    test('disables the underlying button when rendered as one', () => {
      render(
        <Avatar component="button" disabled>
          CX
        </Avatar>
      )
      expect(screen.getByRole('button', { name: 'CX' })).toBeDisabled()
    })

    test('marks a disabled link as aria-disabled and prevents navigation', () => {
      render(
        <Avatar href="/profile" disabled>
          CX
        </Avatar>
      )
      const link = screen.getByRole('link', { name: 'CX' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span by default', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Avatar ref={ref}>CX</Avatar>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Avatar color="primary" status="success">
          CX
        </Avatar>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
