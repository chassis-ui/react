import * as React from 'react'
import { flushSync } from 'react-dom'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Popover, Button, Menu, MenuItem, MenuList, MenuToggle, Modal } from '../../../src/index'

const openPopover = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Test' }))
}

// A press as a browser reports it: `pointerdown`, which the popover reads for a press outside,
// then `click`.
const press = (target: Element) => {
  fireEvent.pointerDown(target)
  fireEvent.click(target)
}

const settle = () => {
  act(() => vi.runAllTimers())
}

describe('Popover', () => {
  describe('rendering', () => {
    test('renders the trigger button collapsed before the popover is shown', () => {
      render(
        <Popover content="A">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveClass('button', 'primary')
      expect(trigger).toHaveAttribute('type', 'button')
    })

    test('renders title, content, placement and arrow once shown', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title" placement="right">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())

      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      const popover = screen.getByRole('dialog')
      expect(popover).toHaveClass('popover', 'cx-popover-auto', 'fade', 'show')
      expect(popover).toHaveAttribute('data-cx-placement')
      expect(popover).toHaveAttribute('tabindex', '-1')
      expect(trigger.getAttribute('aria-controls')).toBe(popover.getAttribute('id'))

      const header = screen.getByText('title')
      expect(header).toHaveClass('popover-header')
      expect(popover.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'))

      const body = screen.getByText('content')
      expect(body).toHaveClass('popover-body')

      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      const arrow = popover.querySelector('.popover-arrow')
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
          <Popover content="content" title="title">
            <Button>Test</Button>
          </Popover>
        </dialog>
      )
      openPopover()
      act(() => vi.runAllTimers())
      const dialogs = screen.getAllByRole('dialog')
      const [ancestorDialog, popover] = dialogs
      expect(popover).toBeInTheDocument()
      expect(ancestorDialog!.contains(popover!)).toBe(true)
      vi.useRealTimers()
    })

    // Regression test: the container was resolved in a passive effect, after the panel had mounted
    // into `document.body`, so content in a dialog mounted twice on its first open.
    test('mounts its content once, in the dialog it opens in', () => {
      vi.useFakeTimers()
      const mounts = vi.fn()
      function Content() {
        React.useEffect(() => mounts(), [])
        return <>content</>
      }
      render(
        <dialog open>
          <Popover content={<Content />}>
            <Button>Test</Button>
          </Popover>
        </dialog>
      )
      openPopover()
      settle()
      expect(mounts).toHaveBeenCalledTimes(1)
      const [ancestorDialog, popover] = screen.getAllByRole('dialog')
      expect(ancestorDialog).toContainElement(popover!)
      expect(popover).toHaveClass('fade', 'show')
      vi.useRealTimers()
    })

    test('mounted open in a modal, mounts its content once, in the modal', () => {
      vi.useFakeTimers()
      const mounts = vi.fn()
      function Content() {
        React.useEffect(() => mounts(), [])
        return <>content</>
      }
      render(
        <Modal instant visible>
          <Popover content={<Content />} defaultVisible>
            <Button>Test</Button>
          </Popover>
        </Modal>
      )
      settle()
      expect(mounts).toHaveBeenCalledTimes(1)
      // A closed or unopened <dialog> has no role, so the modal is found by its tag.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('dialog.modal')).toContainElement(screen.getByText('content'))
      vi.useRealTimers()
    })

    test('responds to the visible prop changing after mount', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Popover content="content" title="title" visible={false}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      rerender(
        <Popover content="content" title="title" visible={true}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(
        <Popover content="content" title="title" visible={false}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('dismissal', () => {
    test('Escape closes the popover and returns focus to the trigger', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
      vi.useRealTimers()
    })

    // On the press, not the click that follows it.
    test('a press outside the trigger and panel closes the popover', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.pointerDown(document.body)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('a press on the trigger leaves closing to its click', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      fireEvent.pointerDown(screen.getByRole('button', { name: 'Test' }))
      settle()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      openPopover()
      settle()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    // Regression test: outside was read on `click`, by DOM containment. A control that takes
    // itself out of the document in its own click handler was in no panel by then, so using it
    // closed the popover. A browser renders the handler's update before `window` hears the click;
    // a dispatched event doesn't, so the handler flushes it.
    // Regression test: seen from `window`, a press on a trigger in a shadow root targets the
    // shadow host, which the trigger doesn't contain. The press closed the popover and its click
    // opened it again.
    test('a press on a trigger inside a shadow root toggles the popover closed', () => {
      vi.useFakeTimers()
      const host = document.createElement('div')
      document.body.append(host)
      const container = document.createElement('div')
      host.attachShadow({ mode: 'open' }).append(container)
      render(
        <Popover content="content">
          <Button>Test</Button>
        </Popover>,
        { container }
      )
      const trigger = within(container).getByRole('button', { name: 'Test' })
      fireEvent.click(trigger)
      settle()
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      press(trigger)
      settle()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      host.remove()
      vi.useRealTimers()
    })

    test('an element removed by its own click is not a press outside', () => {
      vi.useFakeTimers()
      const Removable = () => {
        const [shown, setShown] = React.useState(true)
        return shown ? (
          <button type="button" onClick={() => flushSync(() => setShown(false))}>
            Remove
          </button>
        ) : (
          <span>Removed</span>
        )
      }
      render(
        <Popover content={<Removable />}>
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      press(screen.getByRole('button', { name: 'Remove' }))
      settle()
      expect(screen.getByText('Removed')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      vi.useRealTimers()
    })

    test('a click inside the panel does not close the popover', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      const popover = screen.getByRole('dialog')

      fireEvent.click(screen.getByText('content'))
      act(() => vi.runAllTimers())
      expect(popover).toBeInTheDocument()
      vi.useRealTimers()
    })

    // Regression test: the exit used to return focus to the trigger unconditionally, so
    // dismissing by clicking another control yanked focus straight back off whatever the user
    // had just clicked. Focus is only reclaimed when nothing else has taken it (the Escape case
    // above), never when the user deliberately moved it somewhere.
    test('a click on another control closes the popover without stealing focus back', () => {
      vi.useFakeTimers()
      render(
        <>
          <Popover content="content" title="title">
            <Button>Test</Button>
          </Popover>
          <Button>Elsewhere</Button>
        </>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      const elsewhere = screen.getByRole('button', { name: 'Elsewhere' })
      act(() => elsewhere.focus())
      press(elsewhere)
      act(() => vi.runAllTimers())

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(elsewhere)
      vi.useRealTimers()
    })
  })

  // Regression tests: inside was the panel's and the trigger's DOM subtree only, so a press in
  // an overlay opened from the content, which is portaled out of the panel, closed the popover.
  describe('overlays opened from the content', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    const Nested = () => (
      <Popover
        content={
          <Popover content="inner content">
            <Button>Inner</Button>
          </Popover>
        }
        title="outer title"
      >
        <Button>Test</Button>
      </Popover>
    )

    const openNested = () => {
      render(<Nested />)
      openPopover()
      settle()
      press(screen.getByRole('button', { name: 'Inner' }))
      settle()
      expect(screen.getByText('inner content')).toBeInTheDocument()
    }

    test('a press inside a nested popover leaves both open', () => {
      openNested()
      // The inner panel is beside the outer one in the document, not inside it.
      expect(screen.getByRole('dialog', { name: 'outer title' })).not.toContainElement(
        screen.getByText('inner content')
      )
      press(screen.getByText('inner content'))
      settle()
      expect(screen.getByText('inner content')).toBeInTheDocument()
      expect(screen.getByText('outer title')).toBeInTheDocument()
    })

    test('a press in the outer popover closes the nested one only', () => {
      openNested()
      press(screen.getByText('outer title'))
      settle()
      expect(screen.queryByText('inner content')).not.toBeInTheDocument()
      expect(screen.getByText('outer title')).toBeInTheDocument()
    })

    test('a press outside both closes both', () => {
      openNested()
      press(document.body)
      settle()
      expect(screen.queryByText('inner content')).not.toBeInTheDocument()
      expect(screen.queryByText('outer title')).not.toBeInTheDocument()
    })

    test('a press on an item of a Menu teleported out of the content leaves the popover open', () => {
      render(
        <Popover
          content={
            <Menu container>
              <MenuToggle>Options</MenuToggle>
              <MenuList>
                <MenuItem>Rename</MenuItem>
              </MenuList>
            </Menu>
          }
        >
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      fireEvent.click(screen.getByRole('button', { name: 'Options' }))
      settle()
      const item = screen.getByRole('menuitem', { name: 'Rename' })
      expect(screen.getByRole('dialog')).not.toContainElement(item)

      press(item)
      settle()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  // Regression tests: every open overlay listened for Escape on `window` by itself, and a
  // non-modal dialog for any keydown inside it, so one press closed the whole chain.
  describe('Escape among other overlays', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    const escape = (target: Element | Window = window) =>
      fireEvent.keyDown(target, { key: 'Escape' })

    test('closes the innermost popover only', () => {
      render(
        <Popover
          content={
            <Popover content="inner content">
              <Button>Inner</Button>
            </Popover>
          }
          title="outer title"
        >
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      press(screen.getByRole('button', { name: 'Inner' }))
      settle()

      escape()
      settle()
      expect(screen.queryByText('inner content')).not.toBeInTheDocument()
      expect(screen.getByText('outer title')).toBeInTheDocument()

      escape()
      settle()
      expect(screen.queryByText('outer title')).not.toBeInTheDocument()
    })

    test('closes a popover in a non-modal Modal, and leaves the modal to the next press', () => {
      const onClose = vi.fn()
      render(
        <Modal instant modal={false} onClose={onClose} visible>
          <Popover content="content">
            <Button>Test</Button>
          </Popover>
        </Modal>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      settle()
      expect(screen.getByText('content')).toBeInTheDocument()

      escape(trigger)
      settle()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
      expect(onClose).not.toHaveBeenCalled()

      escape(trigger)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    // A modal dialog closes on the browser's `cancel`, which follows an Escape keydown nothing
    // has prevented. jsdom sends none, so the test reads whether the keydown was prevented.
    test('prevents the Escape it takes in a modal Modal, so the browser sends the modal no cancel', () => {
      render(
        <Modal instant visible>
          <Popover content="content">
            <Button>Test</Button>
          </Popover>
        </Modal>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      settle()

      expect(escape(trigger)).toBe(false)
      settle()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
      // With no overlay left inside it, the key is the modal's.
      expect(escape(trigger)).toBe(true)
    })

    test('a modal opened over an open popover keeps Escape from it', () => {
      const { rerender } = render(
        <>
          <Popover content="content" defaultVisible>
            <Button>Test</Button>
          </Popover>
          <Modal instant>Modal</Modal>
        </>
      )
      settle()
      rerender(
        <>
          <Popover content="content" defaultVisible>
            <Button>Test</Button>
          </Popover>
          <Modal instant visible>
            Modal
          </Modal>
        </>
      )
      expect(escape()).toBe(true)
      settle()
      expect(screen.getByText('content')).toBeInTheDocument()
    })

    // Regression tests: a popover held open by `visible` with no `onVisibleChange` can't close,
    // and on top of the stack it prevented every Escape, the modal's under it too.
    test('a popover held open by visible alone leaves Escape to the modal Modal it is in', () => {
      const tree = (visible: boolean) => (
        <Modal instant visible>
          <Popover content="content" visible={visible}>
            <Button>Test</Button>
          </Popover>
        </Modal>
      )
      const { rerender } = render(tree(false))
      settle()
      rerender(tree(true))
      settle()
      expect(escape(screen.getByRole('button', { name: 'Test' }))).toBe(true)
    })

    test('a popover held open by visible alone leaves Escape to the non-modal Modal it is in', () => {
      const onClose = vi.fn()
      const tree = (visible: boolean) => (
        <Modal instant modal={false} onClose={onClose} visible>
          <Popover content="content" visible={visible}>
            <Button>Test</Button>
          </Popover>
        </Modal>
      )
      const { rerender } = render(tree(false))
      settle()
      rerender(tree(true))
      settle()
      escape(screen.getByRole('button', { name: 'Test' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('leaves an Escape that something else has prevented alone', () => {
      render(
        <Popover content="content">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      const prevent = (event: KeyboardEvent) => event.preventDefault()
      document.addEventListener('keydown', prevent)
      escape(document.body)
      document.removeEventListener('keydown', prevent)
      settle()
      expect(screen.getByText('content')).toBeInTheDocument()
    })
  })

  describe('show/hide callbacks', () => {
    // Regression test: `onShow`/`onHide` report transitions, so mounting closed fires neither.
    // The visibility effect used to run its `else` branch on the initial commit, reporting a
    // close for a popover that had never been shown.
    test('neither callback fires on mount', () => {
      const onShow = vi.fn()
      const onHide = vi.fn()
      render(
        <Popover content="content" title="title" onShow={onShow} onHide={onHide}>
          <Button>Test</Button>
        </Popover>
      )
      expect(onHide).not.toHaveBeenCalled()
      expect(onShow).not.toHaveBeenCalled()
    })

    // Regression test: a `mounted` flag survived StrictMode's second run of the effect on mount,
    // which then reported a hide for a closed popover, and a show for one mounted open.
    test('neither callback fires on mount under StrictMode, closed or open', () => {
      const onShow = vi.fn()
      const onHide = vi.fn()
      render(
        <React.StrictMode>
          <Popover content="content" onShow={onShow} onHide={onHide}>
            <Button>Closed</Button>
          </Popover>
          <Popover content="content" defaultVisible onShow={onShow} onHide={onHide}>
            <Button>Open</Button>
          </Popover>
        </React.StrictMode>
      )
      expect(onHide).not.toHaveBeenCalled()
      expect(onShow).not.toHaveBeenCalled()
    })

    test('onShow fires on open and onHide on close', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onHide = vi.fn()
      render(
        <Popover content="content" title="title" onShow={onShow} onHide={onHide}>
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onHide).not.toHaveBeenCalled()

      fireEvent.keyDown(window, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(onHide).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('trigger behavior', () => {
    test("preserves the trigger child's own onClick handler", () => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      render(
        <Popover content="content" title="title">
          <Button onClick={onClick}>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      vi.useRealTimers()
    })

    test("forwards the trigger child's own ref alongside its internal one", () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Popover content="content">
          <Button ref={ref}>Test</Button>
        </Popover>
      )
      expect(ref.current).toBe(screen.getByRole('button', { name: 'Test' }))
    })

    test("states its own condition over the trigger's aria-expanded and aria-controls", () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <button aria-controls="elsewhere" aria-expanded={false} type="button">
            Test
          </button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())

      const trigger = screen.getByRole('button', { name: 'Test' })
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('dialog').id)
      vi.useRealTimers()
    })

    test('keeps a description the trigger component writes for itself', () => {
      const Described = (props: React.ComponentProps<'button'>) => (
        <button aria-describedby="hint" type="button" {...props} />
      )
      render(
        <>
          <p id="hint">Opens the details</p>
          <Popover content="content">
            <Described>Test</Described>
          </Popover>
        </>
      )

      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute(
        'aria-describedby',
        'hint'
      )
    })

    test('renders a trigger that is not one element as it is, with a dev warning', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <Popover content="content">
          <>
            <Button>One</Button>
            <Button>Two</Button>
          </>
        </Popover>
      )

      expect(screen.getByRole('button', { name: 'One' })).not.toHaveAttribute('aria-expanded')
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Popover: expects exactly one React element as its trigger')
      )
      warn.mockRestore()
    })
  })

  describe('focus management', () => {
    test('moves focus into the dialog on open', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(screen.getByRole('dialog'))
      vi.useRealTimers()
    })

    test('restores focus to the trigger once the close transition finishes', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.click(trigger)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).not.toBe(trigger)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
      vi.useRealTimers()
    })
  })

  describe('panel attributes', () => {
    test('className, style, data attributes and handlers go to the panel, beside its own', () => {
      vi.useFakeTimers()
      const onMouseEnter = vi.fn()
      render(
        <Popover
          className="bazinga"
          content="content"
          data-testid="panel"
          defaultVisible
          onMouseEnter={onMouseEnter}
          style={{ maxWidth: 320, top: 999 }}
          title="title"
        >
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())

      const panel = screen.getByRole('dialog')
      expect(panel).toBe(screen.getByTestId('panel'))
      expect(panel).toHaveClass('popover', 'cx-popover-auto', 'fade', 'show', 'bazinga')
      expect(panel).toHaveStyle({ maxWidth: '320px' })
      // The position stays the component's.
      expect(panel.style.top).not.toBe('999px')

      fireEvent.mouseEnter(panel)
      expect(onMouseEnter).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('a caller `id` names the panel, and the trigger still points at it', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" defaultVisible id="details" title="title">
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())

      expect(screen.getByRole('dialog')).toHaveAttribute('id', 'details')
      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute(
        'aria-controls',
        'details'
      )
      vi.useRealTimers()
    })

    test('forwards its ref to the panel, for as long as the panel is mounted', () => {
      vi.useFakeTimers()
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Popover content="content" ref={ref} title="title">
          <Button>Test</Button>
        </Popover>
      )
      expect(ref.current).toBeNull()

      openPopover()
      act(() => vi.runAllTimers())
      expect(ref.current).toBe(screen.getByRole('dialog'))

      fireEvent.keyDown(window, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(ref.current).toBeNull()
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      expect(await axe(document.body)).toHaveNoViolations()
    })

    // Regression tests: with no title the dialog had no name (axe `aria-dialog-name`).
    test('without a title, is named by its trigger', async () => {
      vi.useFakeTimers()
      render(
        <Popover content="content">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      expect(screen.getByRole('dialog')).toHaveAccessibleName('Test')
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test("without a title, is named by its trigger under the trigger's own id", () => {
      vi.useFakeTimers()
      render(
        <Popover content="content">
          <Button id="own-trigger">Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      vi.useRealTimers()
      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute('id', 'own-trigger')
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'own-trigger')
    })

    test('an aria-label names it in place of the trigger', () => {
      vi.useFakeTimers()
      render(
        <Popover aria-label="Details" content="content">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      settle()
      vi.useRealTimers()
      expect(screen.getByRole('dialog')).toHaveAccessibleName('Details')
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
      expect(screen.getByRole('button', { name: 'Test' })).not.toHaveAttribute('id')
    })
  })
})
