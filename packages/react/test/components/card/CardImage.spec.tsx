import fs from 'fs'
import path from 'path'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardImage } from '../../../src/index'

describe('CardImage', () => {
  describe('rendering', () => {
    test('renders an img with the base class by default', () => {
      render(<CardImage alt="test" />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('card-image')
      expect(image.tagName).toBe('IMG')
    })

    test('applies a top orientation class', () => {
      render(<CardImage alt="test" orientation="top" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top')
    })

    test('applies a start/end orientation class', () => {
      render(<CardImage alt="test" orientation="start" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-start')
    })

    test('applies an orientation per breakpoint alongside the base orientation', () => {
      render(<CardImage alt="test" orientation={{ base: 'top', lg: 'start' }} />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top', 'lg:card-image-start')
    })

    test('keeps the plain card-image class when no orientation is set at the base', () => {
      render(<CardImage alt="test" orientation={{ lg: 'start' }} />)
      expect(screen.getByRole('img').className).toBe('card-image lg:card-image-start')
    })

    // `orientation` takes any of its four values at any breakpoint, and chassis-css has the
    // breakpoint classes of two of them, at four of the five: the rest rendered a class with no
    // rule and said nothing. It renders no class now, and warns.
    describe('an orientation chassis-css has no class for', () => {
      const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'] as const
      const ORIENTATIONS = ['top', 'bottom', 'start', 'end'] as const
      const css = fs.readFileSync(
        path.resolve(__dirname, '../../../node_modules/@chassis-ui/css/dist/css/chassis.css'),
        'utf8'
      )
      const combinations = BREAKPOINTS.flatMap((breakpoint) =>
        ORIENTATIONS.map((orientation) => [breakpoint, orientation] as const)
      )

      test('reads the classes of the installed chassis-css', () => {
        expect(css).toContain('.card-image-top')
        expect(css).toContain('.lg\\:card-image-start')
      })

      // Against the stylesheet itself, so the list in the component can't fall behind it.
      test.each(combinations)(
        'at %s for %s, renders the class when chassis-css has it, and warns when not',
        (breakpoint, value) => {
          const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
          const className = `${breakpoint}:card-image-${value}`
          render(<CardImage alt="test" orientation={{ base: 'top', [breakpoint]: value }} />)

          const image = screen.getByRole('img')
          if (css.includes(`.${breakpoint}\\:card-image-${value}`)) {
            expect(image.className).toBe(`card-image-top ${className}`)
            expect(warn).not.toHaveBeenCalled()
          } else {
            // The base class alone: a class with no rule isn't rendered.
            expect(image.className).toBe('card-image-top')
            expect(warn).toHaveBeenCalledTimes(1)
            expect(warn).toHaveBeenCalledWith(expect.stringContaining(className))
          }
          warn.mockRestore()
        }
      )

      test('names the combinations that do nothing', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
        render(<CardImage alt="test" orientation={{ base: 'start', lg: 'top', '2xl': 'end' }} />)
        const messages = warn.mock.calls.map(([message]) => message as string)
        expect(messages).toHaveLength(2)
        expect(messages[0]).toContain('lg:card-image-top')
        expect(messages[1]).toContain('2xl:card-image-end')
        expect(screen.getByRole('img').className).toBe('card-image-start')
        warn.mockRestore()
      })

      test('says nothing about the base, which has all four', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
        for (const orientation of ORIENTATIONS) {
          const { unmount } = render(<CardImage alt="test" orientation={orientation} />)
          expect(screen.getByRole('img')).toHaveClass(`card-image-${orientation}`)
          expect(css).toContain(`.card-image-${orientation}`)
          unmount()
        }
        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })
    })

    test('applies a bottom orientation class and renders as a custom component', () => {
      const { container } = render(
        <CardImage className="bazinga" component="div" orientation="bottom" />
      )
      // Rendered as a bare `div` with no alt text or role, so there is no accessible query
      // that reaches it — `container.firstChild` is the only option.
      // eslint-disable-next-line testing-library/no-node-access
      const image = container.firstChild
      expect(image).toHaveClass('card-image-bottom', 'bazinga')
      expect((image as HTMLElement)?.nodeName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying img', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<CardImage ref={ref} alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardImage alt="A card image" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
