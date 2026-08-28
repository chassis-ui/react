import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { MenuDivider } from '../../../src/index'

describe('MenuDivider', () => {
  describe('rendering', () => {
    test('renders an hr with the base class', () => {
      render(<MenuDivider />)
      expect(screen.getByRole('separator')).toHaveClass('menu-divider')
    })

    test('applies a custom className', () => {
      render(<MenuDivider className="bazinga" />)
      expect(screen.getByRole('separator')).toHaveClass('bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying hr', () => {
      const ref = React.createRef<HTMLHRElement>()
      render(<MenuDivider ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLHRElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<MenuDivider />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
