import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Placeholder } from '../../../src/index'

describe('Placeholder', () => {
  describe('generated graphic', () => {
    test('renders an svg with a title and default width x height text', () => {
      render(<Placeholder width={200} height={100} />)
      const svg = screen.getByRole('img', { hidden: true })
      expect(svg.tagName).toBe('svg')
      expect(svg).toHaveClass('image', 'bg-evident', 'fg-subtle')
      expect(svg).not.toHaveClass('context')
      expect(screen.getByText('Placeholder', { selector: 'title' })).toBeInTheDocument()
      expect(screen.getByText('200x100', { selector: 'text' })).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-label', 'Placeholder: 200x100')
      expect(svg).toHaveAttribute('width', '200')
      expect(svg).toHaveAttribute('height', '100')
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice')
    })

    test('applies the color prop as bg/fg classes', () => {
      render(<Placeholder color="primary" width={100} height={100} />)
      expect(screen.getByRole('img', { hidden: true })).toHaveClass(
        'context',
        'primary',
        'bg-evident',
        'fg-subtle'
      )
    })

    test('hides text and title when explicitly disabled', () => {
      const { container } = render(
        <Placeholder width={100} height={100} text={false} title={false} />
      )
      expect(screen.queryByText('Placeholder', { selector: 'title' })).not.toBeInTheDocument()
      expect(screen.queryByText(/\d+x\d+/, { selector: 'text' })).not.toBeInTheDocument()
      // No role="img" is rendered here (nothing to label), so it can't be reached via getByRole.
      // eslint-disable-next-line testing-library/no-node-access
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    test('supports custom text and title', () => {
      render(<Placeholder width={100} height={100} title="Cover" text="No image yet" />)
      const svg = screen.getByRole('img', { hidden: true })
      expect(screen.getByText('Cover', { selector: 'title' })).toBeInTheDocument()
      expect(screen.getByText('No image yet', { selector: 'text' })).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-label', 'Cover: No image yet')
    })
  })

  describe('src prop', () => {
    test('renders a real img element instead of the generated graphic', () => {
      render(<Placeholder src="https://placehold.co/200x100" alt="A real image" />)
      const img = screen.getByRole('img')
      expect(img.tagName).toBe('IMG')
      expect(img).toHaveAttribute('src', 'https://placehold.co/200x100')
      expect(img).toHaveAttribute('alt', 'A real image')
    })

    test('falls back to the generated label as alt text when alt is omitted', () => {
      render(<Placeholder src="https://placehold.co/200x100" width={200} height={100} />)
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Placeholder: 200x100')
    })

    test('falls back to an empty alt (not a missing attribute) when both alt and label resolve to nothing', () => {
      // An empty `alt` (rather than a missing one) resolves to role="presentation", not "img" -
      // that's the whole point of the fix, so this has to query by tag rather than role.
      const { container } = render(<Placeholder src="https://placehold.co/200x100" title={false} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('styling props (src mode only)', () => {
    test('applies fluid and thumbnail alongside the image base class', () => {
      render(<Placeholder src="https://placehold.co/200x100" alt="test" fluid thumbnail />)
      expect(screen.getByRole('img')).toHaveClass('image', 'fluid', 'thumbnail')
    })

    test('applies rounded and start/end/center alignment', () => {
      const { rerender } = render(
        <Placeholder src="https://placehold.co/200x100" alt="test" rounded align="start" />
      )
      expect(screen.getByRole('img')).toHaveClass('rounded', 'float-start')

      rerender(<Placeholder src="https://placehold.co/200x100" alt="test" align="end" />)
      expect(screen.getByRole('img')).toHaveClass('float-end')

      rerender(<Placeholder src="https://placehold.co/200x100" alt="test" align="center" />)
      expect(screen.getByRole('img')).toHaveClass('d-block', 'mx-auto')
    })

    test('does not apply the image base class when neither fluid nor thumbnail is set', () => {
      render(<Placeholder src="https://placehold.co/200x100" alt="test" rounded />)
      expect(screen.getByRole('img')).not.toHaveClass('image')
    })
  })

  describe('component prop', () => {
    test('renders a custom component instead of img when src is set', () => {
      const CustomImage = React.forwardRef<HTMLDivElement, { alt: string; src: string }>(
        ({ alt, src, ...rest }, ref) => (
          <div ref={ref} data-src={src} {...rest}>
            {alt}
          </div>
        )
      )

      render(
        <Placeholder component={CustomImage} src="https://placehold.co/200x100" alt="Custom" />
      )
      const el = screen.getByText('Custom')
      expect(el.tagName).toBe('DIV')
      expect(el).toHaveAttribute('data-src', 'https://placehold.co/200x100')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying svg by default', () => {
      const ref = React.createRef<SVGSVGElement>()
      // The polymorphic `component`/`ref` type defaults to 'img' since that's what `src` mode
      // renders; the no-`src` generated graphic is an SVGSVGElement at runtime regardless.
      render(
        <Placeholder ref={ref as unknown as React.Ref<HTMLImageElement>} width={100} height={100} />
      )
      expect(ref.current).toBeInstanceOf(SVGSVGElement)
    })

    test('forwards a ref to the underlying img when src is set', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<Placeholder ref={ref} src="https://placehold.co/200x100" alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations for the generated graphic', async () => {
      const { container } = render(<Placeholder width={200} height={100} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations when using src', async () => {
      const { container } = render(
        <Placeholder src="https://placehold.co/200x100" alt="A real image" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
