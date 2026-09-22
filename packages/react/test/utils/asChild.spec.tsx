import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToString as toHtml } from 'react-dom/server'
import { axe } from 'jest-axe'

import { Badge, Button, Card, NavLink, Spinner } from '../../src/index'

// Stands in for a router link (e.g. `next/link`): a component the caller renders as an *element*
// and hands to `asChild`, rather than passing it by reference to `component`.
const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a data-router-link="" ref={ref} {...props} />)
RouterLink.displayName = 'RouterLink'

describe('asChild', () => {
  test('renders the child element in place of the component, with its classes merged on', () => {
    render(
      <Button asChild color="secondary" size="lg">
        <RouterLink className="extra" href="/login">
          Log in
        </RouterLink>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Log in' })
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/login')
    expect(link).toHaveClass('button', 'secondary', 'lg', 'extra')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test("keeps the child's own props over the component's", () => {
    render(
      <Button asChild title="from button">
        <RouterLink href="/login" title="from link">
          Log in
        </RouterLink>
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('title', 'from link')
  })

  test("chains the component's and the child's event handlers", async () => {
    const user = userEvent.setup()
    const calls: string[] = []
    render(
      <Button asChild onClick={() => calls.push('button')}>
        <RouterLink href="#login" onClick={() => calls.push('link')}>
          Log in
        </RouterLink>
      </Button>
    )

    await user.click(screen.getByRole('link', { name: 'Log in' }))
    expect(calls).toEqual(['button', 'link'])
  })

  test("populates both the component's ref and the child's own ref", () => {
    const buttonRef = React.createRef<HTMLAnchorElement>()
    const linkRef = React.createRef<HTMLAnchorElement>()
    render(
      <Button asChild ref={buttonRef}>
        <RouterLink href="/login" ref={linkRef}>
          Log in
        </RouterLink>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Log in' })
    expect(buttonRef.current).toBe(link)
    expect(linkRef.current).toBe(link)
  })

  test('forwards the props a component computes for its element, like aria-current', () => {
    render(
      <NavLink active asChild>
        <RouterLink href="/">Home</RouterLink>
      </NavLink>
    )

    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveClass('nav-link', 'active')
  })

  test("places the component's own inner markup inside the child element", () => {
    render(
      <Spinner asChild visuallyHiddenLabel="Saving">
        <output />
      </Spinner>
    )

    const status = screen.getByRole('status')
    expect(status.tagName).toBe('OUTPUT')
    expect(status).toHaveClass('spinner-border')
    expect(status).toHaveTextContent('Saving')
  })

  test('does not leak into polymorphic components nested inside the child', () => {
    render(
      <Card asChild>
        <section aria-label="Profile">
          <Badge>New</Badge>
        </section>
      </Card>
    )

    const card = screen.getByRole('region', { name: 'Profile' })
    expect(card).toHaveClass('card')
    const badge = screen.getByText('New')
    expect(badge.tagName).toBe('SPAN')
    expect(badge).toHaveClass('badge')
  })

  test('wins over `component` when both are passed, with a dev warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <Button asChild component="span">
        <RouterLink href="/login">Log in</RouterLink>
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveClass('button')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('both `asChild` and `component`'))
    warn.mockRestore()
  })

  test.each([
    ['text', 'Log in'],
    [
      'several elements',
      <>
        <span>Log</span>
        <span>in</span>
      </>
    ]
  ])('falls back to the default element, with a dev warning, given %s', (_, children) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Button asChild>{children}</Button>)

    expect(screen.getByRole('button', { name: /Log\s*in/ })).toHaveClass('button')
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Button: `asChild` expects exactly one')
    )
    warn.mockRestore()
  })

  test('renders unchanged without asChild', () => {
    render(<Button asChild={false}>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveClass('button')
    expect(button).not.toHaveAttribute('aschild')
  })

  test('server-renders the merged child element', () => {
    const html = toHtml(
      <Button asChild>
        <RouterLink href="/login">Log in</RouterLink>
      </Button>
    )

    expect(html).toBe('<a data-router-link="" href="/login" class="button primary">Log in</a>')
  })

  test('has no accessibility violations', async () => {
    const { container } = render(
      <nav aria-label="Account">
        <Button asChild>
          <RouterLink href="/login">Log in</RouterLink>
        </Button>
        <NavLink active asChild>
          <RouterLink href="/">Home</RouterLink>
        </NavLink>
      </nav>
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
