import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu } from '../../../index'

describe('Menu.Item', () => {
  describe('rendering', () => {
    test('renders an anchor with menuitem role by default', () => {
      render(<Menu.Item href="#">Test</Menu.Item>)
      const item = screen.getByRole('menuitem', { name: 'Test' })
      expect(item).toHaveClass('menu-item')
      expect(item.tagName).toBe('A')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Menu.Item href="#">Test</Menu.Item>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a button while keeping menuitem role', () => {
      render(<Menu.Item component="button">Test</Menu.Item>)
      const item = screen.getByRole('menuitem', { name: 'Test' })
      expect(item.tagName).toBe('BUTTON')
    })

    test('applies the selected class', () => {
      render(
        <Menu.Item component="button" selected>
          Test
        </Menu.Item>
      )
      expect(screen.getByRole('menuitem')).toHaveClass('selected')
    })

    test('applies disabled styling and aria-disabled', () => {
      render(
        <Menu.Item href="#" disabled>
          Test
        </Menu.Item>
      )
      const item = screen.getByRole('menuitem')
      expect(item).toHaveClass('disabled')
      expect(item).toHaveAttribute('aria-disabled', 'true')
    })

    test('renders plain children unchanged when icon/description are omitted', () => {
      render(<Menu.Item href="#">Test</Menu.Item>)
      const item = screen.getByRole('menuitem')
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-icon')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-content')).not.toBeInTheDocument()
    })

    test('renders an icon and description', () => {
      render(
        <Menu.Item href="#" icon={<span data-testid="icon" />} description="More info">
          Test
        </Menu.Item>
      )
      const item = screen.getByRole('menuitem', { name: 'TestMore info' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-icon')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-description')).toHaveTextContent('More info')
    })

    test('selected alone does not render a check icon (font-weight only)', () => {
      render(
        <Menu.Item component="button" selected>
          Test
        </Menu.Item>
      )
      const item = screen.getByRole('menuitem')
      expect(item).toHaveClass('selected')
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-check')).not.toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    test('prevents default navigation for placeholder href="#" so the page does not jump to top', () => {
      const handleClick = vi.fn()
      render(
        <Menu.Item href="#" onClick={handleClick}>
          Test
        </Menu.Item>
      )
      const notCancelled = fireEvent.click(screen.getByRole('menuitem'))
      expect(notCancelled).toBe(false)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('leaves a real same-page anchor href free to navigate', () => {
      render(<Menu.Item href="#section">Test</Menu.Item>)
      const notCancelled = fireEvent.click(screen.getByRole('menuitem'))
      expect(notCancelled).toBe(true)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Menu.Item ref={ref} href="#">
          Test
        </Menu.Item>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Menu.Item ref={ref} component="button">
          Test
        </Menu.Item>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations inside a menu', async () => {
      const { container } = render(
        <div role="menu">
          <Menu.Item href="#">Test</Menu.Item>
        </div>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
