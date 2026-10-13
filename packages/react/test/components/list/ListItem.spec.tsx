import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ListItem } from '../../../src/index'

describe('ListItem', () => {
  describe('rendering', () => {
    test('renders an li with the base class by default', () => {
      render(<ListItem>Test</ListItem>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('list-item')
      expect(item.tagName).toBe('LI')
    })

    test('applies color, active and disabled classes together', () => {
      render(
        <ListItem className="bazinga" active={true} color="warning" disabled={true}>
          Test
        </ListItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'list-item',
        'context',
        'warning',
        'active',
        'disabled',
        'bazinga'
      )
    })

    test('renders as an interactive link when component is "a"', () => {
      render(
        <ListItem component="a" href="/bazinga">
          Test
        </ListItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('list-action')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as an interactive button when component is "button"', () => {
      render(<ListItem component="button">Test</ListItem>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('list-action')
    })

    test('exposes aria-current and aria-disabled when active/disabled', () => {
      render(
        <ListItem component="a" href="/bazinga" active disabled>
          Test
        </ListItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })

    test('writes each state class once on an interactive item', () => {
      render(
        <ListItem component="a" href="/bazinga" active disabled>
          Test
        </ListItem>
      )
      const classes = screen.getByRole('link', { name: 'Test' }).className.split(' ')
      expect(classes.filter((name) => name === 'active')).toHaveLength(1)
      expect(classes.filter((name) => name === 'disabled')).toHaveLength(1)
    })

    test('leaves aria-disabled off a disabled button, which has the attribute itself', () => {
      render(
        <ListItem component="button" disabled>
          Test
        </ListItem>
      )
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toBeDisabled()
      expect(button).not.toHaveAttribute('aria-disabled')
    })
  })

  describe('href', () => {
    test('renders an interactive link for href alone', () => {
      render(<ListItem href="/a">Link</ListItem>)
      const link = screen.getByRole('link', { name: 'Link' })
      expect(link).toHaveClass('list-item', 'list-action')
      expect(link).toHaveAttribute('href', '/a')
    })

    test('keeps href off a button given as component', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      render(
        <ListItem component="button" href="/a">
          Action
        </ListItem>
      )
      expect(screen.getByRole('button', { name: 'Action' })).not.toHaveAttribute('href')
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('`href` was ignored'))
      consoleWarn.mockRestore()
    })
  })

  // It rendered `Link` around its element only while that was a link, so a router link whose
  // `href` came or went was a different tree each time, and React remounted it.
  describe('a component whose href comes and goes', () => {
    const mounted = vi.fn()
    function Tracked(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      React.useEffect(mounted, [])
      return <a data-testid="tracked" {...props} />
    }

    beforeEach(() => mounted.mockClear())

    test.each([
      [
        'as component',
        (href?: string) => (
          <ListItem active component={Tracked} disabled href={href}>
            Account
          </ListItem>
        )
      ],
      [
        'as the asChild element',
        (href?: string) => (
          <ListItem active asChild disabled>
            <Tracked href={href}>Account</Tracked>
          </ListItem>
        )
      ]
    ])('stays mounted: %s', (_name, tree) => {
      const { rerender } = render(tree())
      const element = screen.getByTestId('tracked')
      // With no link target it isn't a link: the states are its own classes and attributes, as
      // on the `<li>`, and it isn't taken out of the tab order.
      expect(element).toHaveClass('list-item', 'active', 'disabled')
      expect(element).not.toHaveClass('list-action')
      expect(element).toHaveAttribute('aria-current', 'page')
      expect(element).toHaveAttribute('aria-disabled', 'true')
      expect(element).not.toHaveAttribute('tabindex')
      expect(element).not.toHaveAttribute('role')

      rerender(tree('/account'))
      expect(screen.getByTestId('tracked')).toBe(element)
      expect(element).toHaveClass('list-item', 'list-action', 'active', 'disabled')
      expect(element).toHaveAttribute('href', '/account')
      expect(element).toHaveAttribute('tabindex', '-1')

      rerender(tree())
      expect(screen.getByTestId('tracked')).toBe(element)
      expect(element).not.toHaveClass('list-action')
      expect(element).not.toHaveAttribute('tabindex')
      expect(mounted).toHaveBeenCalledTimes(1)
    })

    test('writes each state class once with no link target', () => {
      render(
        <ListItem active component={Tracked} disabled>
          Account
        </ListItem>
      )
      const classes = screen.getByTestId('tracked').className.split(' ')
      expect(classes.filter((name) => name === 'active')).toHaveLength(1)
      expect(classes.filter((name) => name === 'disabled')).toHaveLength(1)
    })

    test('calls its onClick once with no link target, and adds no button semantics', () => {
      const onClick = vi.fn()
      render(
        <ListItem component={Tracked} onClick={onClick}>
          Account
        </ListItem>
      )
      const element = screen.getByTestId('tracked')
      fireEvent.click(element)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(element).not.toHaveAttribute('role')
      expect(element).not.toHaveAttribute('tabindex')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref for the default li element', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<ListItem ref={ref}>Test</ListItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })

    test('forwards a ref to the underlying anchor when component is "a"', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <ListItem ref={ref} component="a" href="/bazinga">
          Test
        </ListItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button when component is "button"', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <ListItem ref={ref} component="button">
          Test
        </ListItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a plain list item', async () => {
      const { container } = render(
        <ul>
          <ListItem>Test</ListItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as an active link', async () => {
      const { container } = render(
        <ListItem component="a" href="/bazinga" active>
          Test
        </ListItem>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
