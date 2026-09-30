import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Button, Divider } from '../../../src/index'

describe('Divider', () => {
  describe('rendering', () => {
    test('renders an <hr> with .divider, a separator by its own role', () => {
      render(<Divider />)
      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('HR')
      expect(separator).toHaveClass('divider')
      expect(separator).not.toHaveAttribute('role')
      expect(separator).not.toHaveAttribute('aria-orientation')
    })

    test('renders a vertical divider as a <div> with role and orientation', () => {
      render(<Divider orientation="vertical" />)
      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('DIV')
      expect(separator).toHaveClass('divider', 'divider-vertical')
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    })

    test('gives a vertical <hr> its orientation, which its implicit role lacks', () => {
      render(<Divider component="hr" orientation="vertical" />)
      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('HR')
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    })

    test("adds the caller's className after its own", () => {
      render(<Divider className="my-lg" />)
      expect(screen.getByRole('separator')).toHaveClass('divider', 'my-lg')
    })

    test('renders another element as a separator with component', () => {
      render(<Divider component="span" />)
      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('SPAN')
      expect(separator).toHaveAttribute('role', 'separator')
    })
  })

  describe('label', () => {
    test('renders the label in a <div>, and names the separator with it', () => {
      render(<Divider>or</Divider>)
      const separator = screen.getByRole('separator', { name: 'or' })
      expect(separator.tagName).toBe('DIV')
      expect(separator).toHaveClass('divider', 'divider-labelled')
      expect(separator).not.toHaveClass('divider-start', 'divider-end')

      const label = screen.getByText('or')
      expect(label).toHaveClass('divider-label')
      expect(separator).toContainElement(label)
      expect(separator).toHaveAttribute('aria-labelledby', label.id)
    })

    test.each(['start', 'end'] as const)('places the label at the %s', (placement) => {
      render(<Divider labelPlacement={placement}>Section</Divider>)
      expect(screen.getByRole('separator', { name: 'Section' })).toHaveClass(
        'divider-labelled',
        `divider-${placement}`
      )
    })

    test('ignores labelPlacement without a label', () => {
      render(<Divider labelPlacement="start" />)
      expect(screen.getByRole('separator')).not.toHaveClass('divider-start')
    })

    test('labels a vertical divider too', () => {
      render(<Divider orientation="vertical">or</Divider>)
      const separator = screen.getByRole('separator', { name: 'or' })
      expect(separator).toHaveClass('divider-vertical', 'divider-labelled')
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    })

    test("keeps the caller's own name", () => {
      render(<Divider aria-label="Other ways to sign in">or</Divider>)
      const separator = screen.getByRole('separator', { name: 'Other ways to sign in' })
      expect(separator).not.toHaveAttribute('aria-labelledby')
      expect(screen.getByText('or')).toHaveClass('divider-label')
    })

    test.each([
      ['false', false],
      ['true', true],
      ['an empty string', ''],
      ['an empty array', []],
      ['an array of nothing', [null, false, '']]
    ])('renders no label for %s', (_, children) => {
      render(<Divider>{children}</Divider>)
      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('HR')
      expect(separator).not.toHaveClass('divider-labelled')
    })

    test('drops a label an <hr> cannot hold, with a dev warning', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<Divider component="hr">or</Divider>)

      const separator = screen.getByRole('separator')
      expect(separator.tagName).toBe('HR')
      expect(separator).not.toHaveClass('divider-labelled')
      expect(screen.queryByText('or')).not.toBeInTheDocument()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Divider: an `<hr>` cannot hold a label')
      )
      warn.mockRestore()
    })
  })

  describe('asChild', () => {
    test('makes its child the separator, with its own children as the label', () => {
      render(
        <Divider asChild>
          <section className="custom">or</section>
        </Divider>
      )
      const separator = screen.getByRole('separator', { name: 'or' })
      expect(separator.tagName).toBe('SECTION')
      expect(separator).toHaveClass('divider', 'divider-labelled', 'custom')
      expect(screen.getByText('or')).toHaveClass('divider-label')
    })

    test("keeps the name the child was given, over its label's", () => {
      render(
        <Divider asChild>
          <div aria-label="Other ways to sign in">or</div>
        </Divider>
      )
      const separator = screen.getByRole('separator', { name: 'Other ways to sign in' })
      expect(separator).not.toHaveAttribute('aria-labelledby')
      expect(screen.getByText('or')).toHaveClass('divider-label')
    })

    test('leaves an <hr> child its implicit role', () => {
      render(
        <Divider asChild orientation="vertical">
          <hr />
        </Divider>
      )
      const separator = screen.getByRole('separator')
      expect(separator).not.toHaveAttribute('role')
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the root element', () => {
      const ref = React.createRef<HTMLHRElement>()
      render(<Divider ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('separator'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations between a form and other ways to sign in', async () => {
      const { container } = render(
        <>
          <form aria-label="Sign in">
            <Button type="submit">Sign in</Button>
          </form>
          <Divider>or</Divider>
          <div className="hstack gap-md">
            <Button>Google</Button>
            <Divider orientation="vertical" />
            <Button>GitHub</Button>
          </div>
          <Divider />
        </>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
