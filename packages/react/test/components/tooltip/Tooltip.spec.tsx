import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Tooltip, Link } from '../../../src/index'

// react-aria only treats a hover as pointer-triggered (as opposed to touch/virtual) once it's
// seen a real pointer-ish event on the page — establish that modality first. Needs actual
// PointerEvents (not mouse events) for react-aria to recognize the modality under this jsdom
// version.
const hoverOver = (target: HTMLElement) => {
  fireEvent.pointerMove(document.body)
  fireEvent.pointerEnter(target)
}

describe('Tooltip', () => {
  describe('rendering', () => {
    test('renders placement, arrow and content once shown on hover', () => {
      vi.useFakeTimers()
      render(
        <Tooltip trigger="hover" placement="right" content="content">
          <Link className="link">Test</Link>
        </Tooltip>
      )
      const trigger = screen.getByText('Test')
      hoverOver(trigger)
      act(() => vi.runAllTimers())
      act(() => vi.runAllTimers())

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('tooltip', 'cx-tooltip-auto', 'fade', 'show')
      expect(tooltip).toHaveAttribute('data-cx-placement')
      expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.getAttribute('id'))
      expect(screen.getByText('content')).toHaveClass('tooltip-inner')

      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      const arrow = tooltip.querySelector('.tooltip-arrow')
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveAttribute('aria-hidden', 'true')
      expect(arrow).toHaveAttribute('role', 'presentation')
      vi.useRealTimers()
    })
  })

  describe('visibility', () => {
    test('scopes itself to an open dialog ancestor', () => {
      vi.useFakeTimers()
      render(
        <dialog open>
          <Tooltip trigger="hover" content="content">
            <Link className="link">Test</Link>
          </Tooltip>
        </dialog>
      )
      hoverOver(screen.getByText('Test'))
      act(() => vi.runAllTimers())
      const dialog = screen.getByRole('dialog')
      const tooltip = screen.getByRole('tooltip')
      expect(dialog.contains(tooltip)).toBe(true)
      vi.useRealTimers()
    })

    test('responds to the visible prop changing after mount', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Tooltip content="content" visible={false}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      rerender(
        <Tooltip content="content" visible={true}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      rerender(
        <Tooltip content="content" visible={false}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('trigger="focus" ignores hover', () => {
      vi.useFakeTimers()
      render(
        <Tooltip trigger="focus" content="content">
          <Link className="link">Test</Link>
        </Tooltip>
      )
      const link = screen.getByText('Test')
      fireEvent.mouseMove(document.body)
      fireEvent.mouseEnter(link)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('trigger behavior', () => {
    test("forwards the trigger child's own ref alongside its internal one", () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Tooltip content="content">
          <Link ref={ref} href="#">
            Test
          </Link>
        </Tooltip>
      )
      expect(ref.current).toBe(screen.getByRole('link', { name: 'Test' }))
    })

    test("preserves the trigger child's own focus handler", () => {
      const onFocus = vi.fn()
      render(
        <Tooltip content="content">
          <Link href="#" onFocus={onFocus}>
            Test
          </Link>
        </Tooltip>
      )
      act(() => screen.getByRole('link', { name: 'Test' }).focus())
      expect(onFocus).toHaveBeenCalled()
    })

    test("adds its description to the trigger child's own", () => {
      vi.useFakeTimers()
      render(
        <>
          <p id="own">Opens in a new tab</p>
          <Tooltip content="content" defaultVisible id="hint">
            <Link aria-describedby="own" href="#">
              Test
            </Link>
          </Tooltip>
        </>
      )
      act(() => vi.runAllTimers())

      expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute(
        'aria-describedby',
        'hint own'
      )
      vi.useRealTimers()
    })

    test('keeps the trigger mounted when its `href` comes and goes', () => {
      const Counter = (props: { href?: string }) => {
        const [count, setCount] = React.useState(0)
        return (
          <button data-href={props.href} onClick={() => setCount((n) => n + 1)} type="button">
            Count {count}
          </button>
        )
      }
      const { rerender } = render(
        <Tooltip content="content">
          <Counter />
        </Tooltip>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Count 0' }))
      const trigger = screen.getByRole('button', { name: 'Count 1' })

      rerender(
        <Tooltip content="content">
          <Counter href="/next" />
        </Tooltip>
      )
      expect(screen.getByRole('button', { name: 'Count 1' })).toBe(trigger)
    })

    test('renders a trigger that is not one element as it is, with a dev warning', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<Tooltip content="content">{'Just text' as unknown as React.ReactElement}</Tooltip>)

      expect(screen.getByText('Just text')).toBeInTheDocument()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Tooltip: expects exactly one React element as its trigger')
      )
      warn.mockRestore()
    })
  })

  describe('show/hide callbacks', () => {
    // Regression test: `onShow`/`onHide` report transitions, so mounting hidden fires neither.
    // The shared visibility effect used to run its `else` branch on the initial commit,
    // reporting a hide for a tooltip that had never been shown.
    test('neither callback fires on mount', () => {
      const onShow = vi.fn()
      const onHide = vi.fn()
      render(
        <Tooltip content="content" onShow={onShow} onHide={onHide}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      expect(onHide).not.toHaveBeenCalled()
      expect(onShow).not.toHaveBeenCalled()
    })

    // As `Popover` and `Menu`: a tooltip that mounts shown has not changed.
    test('neither callback fires for a tooltip that mounts shown', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onHide = vi.fn()
      render(
        <Tooltip content="content" defaultVisible onShow={onShow} onHide={onHide}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(onShow).not.toHaveBeenCalled()
      expect(onHide).not.toHaveBeenCalled()
      vi.useRealTimers()
    })

    test('onShow fires once shown and onHide once hidden again', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onHide = vi.fn()
      const { rerender } = render(
        <Tooltip content="content" visible={false} onShow={onShow} onHide={onHide}>
          <Link href="#">Test</Link>
        </Tooltip>
      )

      rerender(
        <Tooltip content="content" visible onShow={onShow} onHide={onHide}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onHide).not.toHaveBeenCalled()

      rerender(
        <Tooltip content="content" visible={false} onShow={onShow} onHide={onHide}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(onHide).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('beside other overlays', () => {
    // react-aria stops every Escape at the document while a tooltip is open, and closes the
    // tooltip with it. A tooltip that `visible` holds open never closes, so it would swallow
    // Escape for the whole page.
    test('a tooltip held open by `visible` lets Escape through, and still describes its trigger', () => {
      vi.useFakeTimers()
      const onEscape = vi.fn()
      window.addEventListener('keydown', onEscape)
      render(
        <Tooltip content="content" visible>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())

      const tooltip = screen.getByRole('tooltip')
      expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute(
        'aria-describedby',
        tooltip.getAttribute('id')
      )

      fireEvent.keyDown(document.body, { key: 'Escape' })
      fireEvent.keyDown(document.body, { key: 'Escape' })
      expect(onEscape).toHaveBeenCalledTimes(2)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      window.removeEventListener('keydown', onEscape)
      vi.useRealTimers()
    })

    test('a tooltip that can close takes the first Escape for itself', () => {
      vi.useFakeTimers()
      const onEscape = vi.fn()
      window.addEventListener('keydown', onEscape)
      render(
        <Tooltip content="content" defaultVisible>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())

      fireEvent.keyDown(document.body, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      expect(onEscape).not.toHaveBeenCalled()

      fireEvent.keyDown(document.body, { key: 'Escape' })
      expect(onEscape).toHaveBeenCalledTimes(1)

      window.removeEventListener('keydown', onEscape)
      vi.useRealTimers()
    })

    // react-stately shows one tooltip at a time, but only counts one it opened itself.
    test('a tooltip shown by `defaultVisible` hides when another tooltip opens', () => {
      vi.useFakeTimers()
      render(
        <>
          <Tooltip content="first" defaultVisible>
            <Link href="#">A</Link>
          </Tooltip>
          <Tooltip content="second">
            <Link href="#">B</Link>
          </Tooltip>
        </>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toHaveTextContent('first')

      hoverOver(screen.getByRole('link', { name: 'B' }))
      act(() => vi.runAllTimers())
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toHaveTextContent('second')
      vi.useRealTimers()
    })

    test('a tooltip shown by `visible` is asked to hide when another tooltip opens', () => {
      vi.useFakeTimers()
      const onVisibleChange = vi.fn()
      render(
        <>
          <Tooltip content="first" visible onVisibleChange={onVisibleChange}>
            <Link href="#">A</Link>
          </Tooltip>
          <Tooltip content="second">
            <Link href="#">B</Link>
          </Tooltip>
        </>
      )
      act(() => vi.runAllTimers())

      hoverOver(screen.getByRole('link', { name: 'B' }))
      act(() => vi.runAllTimers())
      expect(onVisibleChange).toHaveBeenCalledWith(false)
      // It is the caller's to follow: both show until `visible` changes.
      expect(screen.getAllByRole('tooltip')).toHaveLength(2)
      vi.useRealTimers()
    })
  })

  describe('panel attributes', () => {
    test('className, style and data attributes go to the panel, beside its own', () => {
      vi.useFakeTimers()
      render(
        <Tooltip
          className="bazinga"
          content="content"
          data-testid="panel"
          defaultVisible
          style={{ maxWidth: 320, top: 999 }}
        >
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())

      const panel = screen.getByRole('tooltip')
      expect(panel).toBe(screen.getByTestId('panel'))
      expect(panel).toHaveClass('tooltip', 'cx-tooltip-auto', 'fade', 'show', 'bazinga')
      expect(panel).toHaveStyle({ maxWidth: '320px' })
      // The position stays the component's.
      expect(panel.style.top).not.toBe('999px')
      vi.useRealTimers()
    })

    test('a caller `id` names the panel, and the trigger is still described by it', () => {
      vi.useFakeTimers()
      render(
        <Tooltip content="content" defaultVisible id="hint">
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())

      expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'hint')
      expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute('aria-describedby', 'hint')
      vi.useRealTimers()
    })

    test('forwards its ref to the panel, for as long as the panel is mounted', () => {
      vi.useFakeTimers()
      const ref = React.createRef<HTMLDivElement>()
      const { rerender } = render(
        <Tooltip content="content" ref={ref} visible={false}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      expect(ref.current).toBeNull()

      rerender(
        <Tooltip content="content" ref={ref} visible>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(ref.current).toBe(screen.getByRole('tooltip'))

      rerender(
        <Tooltip content="content" ref={ref} visible={false}>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(ref.current).toBeNull()
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when visible', async () => {
      vi.useFakeTimers()
      render(
        <Tooltip content="content" visible>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      // The tooltip portals to document.body directly, sibling to the trigger's own render
      // container — neither sits inside a page landmark in this isolated fixture, which trips
      // axe's "region" best-practice rule. That rule is about overall page structure, not
      // anything Tooltip itself controls, so it's disabled for this check.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
