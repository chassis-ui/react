import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenuDivider } from '../../../index'

describe('CxMenuDivider', () => {
  describe('rendering', () => {
    test('renders an hr with the base class', () => {
      render(<CxMenuDivider />)
      expect(screen.getByRole('separator')).toHaveClass('menu-divider')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxMenuDivider />)
      expect(container).toMatchSnapshot()
    })

    test('applies a custom className', () => {
      render(<CxMenuDivider className="bazinga" />)
      expect(screen.getByRole('separator')).toHaveClass('bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying hr', () => {
      const ref = React.createRef<HTMLHRElement>()
      render(<CxMenuDivider ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLHRElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxMenuDivider />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
