import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToString as toHtml } from 'react-dom/server'
import { axe } from 'jest-axe'

import {
  Badge,
  Button,
  Card,
  CloseButton,
  Link,
  List,
  ListItem,
  NavLink,
  Placeholder,
  Spinner,
  Stepper,
  StepperItem
} from '../../src/index'

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

  test("adds the component's description to the child's own", () => {
    render(
      <>
        <p id="theirs">Signs you out</p>
        <p id="own">Opens in a new tab</p>
        <Button aria-describedby="theirs" asChild>
          <a aria-describedby="own" href="/logout">
            Log out
          </a>
        </Button>
      </>
    )

    expect(screen.getByRole('link', { name: 'Log out' })).toHaveAttribute(
      'aria-describedby',
      'theirs own'
    )
  })

  test('keeps a description the child component writes for itself', () => {
    const DescribedLink = (props: React.ComponentProps<'a'>) => (
      <a aria-describedby="own" {...props} />
    )
    render(
      <>
        <p id="own">Opens in a new tab</p>
        <Button asChild>
          <DescribedLink href="/logout">Log out</DescribedLink>
        </Button>
      </>
    )

    expect(screen.getByRole('link', { name: 'Log out' })).toHaveAttribute('aria-describedby', 'own')
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

// `test/utils/asChild.matrix.spec.tsx` compares attributes across every component. These cover
// what attributes don't show: what a click does, what wraps the element, what stays mounted.
describe('asChild keeps the semantics of the element it renders', () => {
  test.each([
    ['an <a>', <a href="#target">Open</a>],
    ['a router link', <RouterLink href="#target">Open</RouterLink>]
  ])('a disabled component blocks the click of %s', async (_, child) => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onChildClick = vi.fn()
    const onDocumentClick = vi.fn((event: MouseEvent) => event.defaultPrevented)
    document.addEventListener('click', onDocumentClick)

    render(
      <Button asChild disabled onClick={onClick}>
        {React.cloneElement(child, { onClick: onChildClick })}
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Open' })
    await user.click(link)
    document.removeEventListener('click', onDocumentClick)

    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    expect(link).not.toHaveAttribute('disabled')
    expect(onDocumentClick).toHaveReturnedWith(true)
    expect(onClick).not.toHaveBeenCalled()
    expect(onChildClick).not.toHaveBeenCalled()
  })

  test('a disabled Link blocks the click of its child', async () => {
    const user = userEvent.setup()
    const onChildClick = vi.fn()
    render(
      <Link asChild disabled>
        <RouterLink href="#target" onClick={onChildClick}>
          Open
        </RouterLink>
      </Link>
    )

    await user.click(screen.getByRole('link', { name: 'Open' }))
    expect(onChildClick).not.toHaveBeenCalled()
  })

  test('a <button> child is disabled natively and keeps its own type', () => {
    render(
      <Button asChild disabled>
        <button type="submit">Save</button>
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).not.toHaveClass('disabled')
    expect(button).not.toHaveAttribute('aria-disabled')
  })

  test('a child with no semantics of its own gets button semantics', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button asChild onClick={onClick}>
        <div>Save</div>
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.tagName).toBe('DIV')
    expect(button).toHaveAttribute('tabindex', '0')
    button.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('a component child with no link target is trusted with its own semantics', () => {
    render(
      <CloseButton asChild disabled size="sm">
        <Button>Dismiss</Button>
      </CloseButton>
    )

    const button = screen.getByRole('button', { name: 'Dismiss' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('button', 'sm')
    expect(button).not.toHaveClass('close-button')
  })

  test('CloseButton styles and labels a link child', () => {
    render(
      <CloseButton asChild color="danger">
        <RouterLink href="/inbox" />
      </CloseButton>
    )

    const link = screen.getByRole('link', { name: 'Close' })
    expect(link).toHaveClass('close-button', 'context', 'danger')
  })

  test.each([
    ['an <a>', <a href="/a">A</a>],
    ['a router link', <RouterLink href="/a">A</RouterLink>]
  ])('List renders no <ul> around an item that is %s', (_, child) => {
    render(
      <List data-testid="list">
        <ListItem asChild>{child}</ListItem>
        <ListItem>B</ListItem>
      </List>
    )

    expect(screen.getByTestId('list').tagName).toBe('DIV')
    expect(screen.getByRole('link', { name: 'A' })).toHaveClass('list-item', 'list-action')
    expect(screen.getByText('B').tagName).toBe('DIV')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  test('List keeps <li> items inside a <ul> child of its own', () => {
    render(
      <List asChild>
        <ul data-testid="list">
          <ListItem>A</ListItem>
        </ul>
      </List>
    )

    expect(screen.getByTestId('list')).toHaveClass('list')
    expect(screen.getByText('A').tagName).toBe('LI')
  })

  test('Stepper renders no <ol> around a step that is a link', () => {
    render(
      <Stepper data-testid="stepper">
        <StepperItem asChild>
          <RouterLink href="/cart">Cart</RouterLink>
        </StepperItem>
        <StepperItem>Payment</StepperItem>
      </Stepper>
    )

    expect(screen.getByTestId('stepper').tagName).toBe('DIV')
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveClass('stepper-item')
    expect(screen.getByText('Payment').tagName).toBe('DIV')
  })

  test('Stepper keeps <li> steps inside an <ol> child of its own', () => {
    render(
      <Stepper asChild>
        <ol data-testid="stepper">
          <StepperItem>Cart</StepperItem>
        </ol>
      </Stepper>
    )

    expect(screen.getByTestId('stepper')).toHaveClass('stepper')
    expect(screen.getByText('Cart').tagName).toBe('LI')
  })

  test('Placeholder renders its child as the image', () => {
    render(
      <Placeholder asChild fluid rounded>
        <img src="/hero.jpg" alt="Hero" />
      </Placeholder>
    )

    const image = screen.getByRole('img', { name: 'Hero' })
    expect(image.tagName).toBe('IMG')
    expect(image).toHaveAttribute('src', '/hero.jpg')
    expect(image).toHaveClass('image', 'fluid', 'rounded')
  })

  test('keeps the child mounted when the component re-renders', () => {
    const mounted = vi.fn()
    function Tracked(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      React.useEffect(mounted, [])
      return <a {...props} />
    }
    const { rerender } = render(
      <Button asChild>
        <Tracked href="/login">Log in</Tracked>
      </Button>
    )
    rerender(
      <Button asChild disabled>
        <Tracked href="/login">Log in</Tracked>
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('aria-disabled', 'true')
    expect(mounted).toHaveBeenCalledTimes(1)
  })

  test('puts nothing of its own on the element', () => {
    render(
      <Button asChild>
        <a href="/login">Log in</a>
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Log in' }).getAttributeNames().sort()).toEqual([
      'class',
      'href'
    ])
  })

  test('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Button asChild disabled>
          <RouterLink href="/login">Log in</RouterLink>
        </Button>
        <CloseButton asChild>
          <RouterLink href="/inbox" />
        </CloseButton>
        <List>
          <ListItem asChild>
            <RouterLink href="/a">A</RouterLink>
          </ListItem>
          <ListItem>B</ListItem>
        </List>
      </main>
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
