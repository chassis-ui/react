import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { AvatarImage } from '../../../src/index'

describe('AvatarImage', () => {
  describe('rendering', () => {
    test('renders an img with the base class', () => {
      render(<AvatarImage src="https://i.pravatar.cc/256" alt="Profile picture" />)
      const image = screen.getByRole('img', { name: 'Profile picture' })
      expect(image).toHaveClass('avatar-image')
      expect(image.tagName).toBe('IMG')
      expect(image).toHaveAttribute('src', 'https://i.pravatar.cc/256')
    })

    test('applies the caller className alongside the base class', () => {
      render(
        <AvatarImage className="bazinga" src="https://i.pravatar.cc/256" alt="Profile picture" />
      )
      expect(screen.getByRole('img', { name: 'Profile picture' })).toHaveClass(
        'avatar-image',
        'bazinga'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying img', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<AvatarImage ref={ref} src="https://i.pravatar.cc/256" alt="Profile picture" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <AvatarImage src="https://i.pravatar.cc/256" alt="Profile picture" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
