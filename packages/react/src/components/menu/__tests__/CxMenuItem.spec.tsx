import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenuItem } from '../../../index'

describe('CxMenuItem', () => {
  describe('rendering', () => {
    test('renders an anchor with menuitem role by default', () => {
      render(<CxMenuItem href="#">Test</CxMenuItem>)
      const item = screen.getByRole('menuitem', { name: 'Test' })
      expect(item).toHaveClass('menu-item')
      expect(item.tagName).toBe('A')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxMenuItem href="#">Test</CxMenuItem>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a button while keeping menuitem role', () => {
      render(<CxMenuItem component="button">Test</CxMenuItem>)
      const item = screen.getByRole('menuitem', { name: 'Test' })
      expect(item.tagName).toBe('BUTTON')
    })

    test('applies the selected class', () => {
      render(
        <CxMenuItem component="button" selected>
          Test
        </CxMenuItem>
      )
      expect(screen.getByRole('menuitem')).toHaveClass('selected')
    })

    test('applies disabled styling and aria-disabled', () => {
      render(
        <CxMenuItem href="#" disabled>
          Test
        </CxMenuItem>
      )
      const item = screen.getByRole('menuitem')
      expect(item).toHaveClass('disabled')
      expect(item).toHaveAttribute('aria-disabled', 'true')
    })

    test('renders plain children unchanged when icon/description are omitted', () => {
      render(<CxMenuItem href="#">Test</CxMenuItem>)
      const item = screen.getByRole('menuitem')
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-icon')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-content')).not.toBeInTheDocument()
    })

    test('renders an icon and description', () => {
      render(
        <CxMenuItem href="#" icon={<span data-testid="icon" />} description="More info">
          Test
        </CxMenuItem>
      )
      const item = screen.getByRole('menuitem', { name: 'TestMore info' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-icon')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-description')).toHaveTextContent('More info')
    })

    test('selected alone does not render a check icon (font-weight only)', () => {
      render(
        <CxMenuItem component="button" selected>
          Test
        </CxMenuItem>
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
        <CxMenuItem href="#" onClick={handleClick}>
          Test
        </CxMenuItem>
      )
      const notCancelled = fireEvent.click(screen.getByRole('menuitem'))
      expect(notCancelled).toBe(false)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('leaves a real same-page anchor href free to navigate', () => {
      render(<CxMenuItem href="#section">Test</CxMenuItem>)
      const notCancelled = fireEvent.click(screen.getByRole('menuitem'))
      expect(notCancelled).toBe(true)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxMenuItem ref={ref} href="#">
          Test
        </CxMenuItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <CxMenuItem ref={ref} component="button">
          Test
        </CxMenuItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations inside a menu', async () => {
      const { container } = render(
        <div role="menu">
          <CxMenuItem href="#">Test</CxMenuItem>
        </div>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
