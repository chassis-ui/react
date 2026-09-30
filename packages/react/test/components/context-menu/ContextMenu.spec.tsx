import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  ContextMenu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuSubmenu
} from '../../../src/index'

// The region with a menu of three items, and a button inside the region so a keyboard user has
// something to focus.
const Subject = (props: React.ComponentProps<typeof ContextMenu>) => (
  <ContextMenu data-testid="region" {...props}>
    <button type="button">Inside</button>
    <MenuList>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuDivider />
      <MenuItem>Delete</MenuItem>
    </MenuList>
  </ContextMenu>
)

const region = () => screen.getByTestId('region')
// The region's own list: a submenu's panel is a second `menu`, portaled to the body too, and
// labelled by its `.menu-item` trigger where the region's is labelled by the region.
const menu = () =>
  screen.getAllByRole('menu', { hidden: true }).find((candidate) => {
    const labelledBy = candidate.getAttribute('aria-labelledby')
    return !labelledBy || labelledBy === region().id
  })!
const isOpen = () => menu().classList.contains('show')
const rightClick = (target: Element, x = 120, y = 80) =>
  fireEvent.contextMenu(target, { clientX: x, clientY: y })
const settle = () => {
  act(() => vi.runAllTimers())
}

describe('ContextMenu', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // jsdom lays nothing out, and the menu's keyboard navigation skips an item with no size: a
    // height makes every item count (as in `Menu.spec.tsx`).
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rendering', () => {
    test('renders a div with the base class, the className merged, and forwards a ref to it', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Subject className="custom" ref={ref} />)
      expect(region()).toHaveClass('context-menu', 'custom')
      expect(region().tagName).toBe('DIV')
      expect(ref.current).toBe(region())
    })

    test('renders as another element with `component`', () => {
      render(
        <ul>
          <ContextMenu component="li" data-testid="row">
            Row
            <MenuList>
              <MenuItem>Open</MenuItem>
            </MenuList>
          </ContextMenu>
        </ul>
      )
      expect(screen.getByTestId('row').tagName).toBe('LI')
    })

    test("`asChild` makes the child the region, and labels the list by the child's own id", () => {
      render(
        <ul>
          <ContextMenu asChild>
            <li id="row-1" data-testid="region">
              Row
              <MenuList>
                <MenuItem>Open</MenuItem>
              </MenuList>
            </li>
          </ContextMenu>
        </ul>
      )
      expect(region().tagName).toBe('LI')
      expect(region()).toHaveClass('context-menu')
      expect(region()).toHaveAttribute('id', 'row-1')
      expect(menu()).toHaveAttribute('aria-labelledby', 'row-1')
      rightClick(region())
      expect(isOpen()).toBe(true)
    })

    test('portals the list out of the region, closed, labelled by the region', () => {
      render(<Subject />)
      expect(isOpen()).toBe(false)
      expect(region()).not.toContainElement(menu())
      expect(document.body).toContainElement(menu())
      expect(region()).toHaveAttribute('id')
      expect(menu()).toHaveAttribute('aria-labelledby', region().id)
    })

    test("uses the region's own id for the label", () => {
      render(<Subject id="files" />)
      expect(region()).toHaveAttribute('id', 'files')
      expect(menu()).toHaveAttribute('aria-labelledby', 'files')
    })

    test('an `aria-label` on the list replaces the label by the region', () => {
      render(
        <ContextMenu data-testid="region">
          Region
          <MenuList aria-label="Actions for Report.pdf">
            <MenuItem>Open</MenuItem>
          </MenuList>
        </ContextMenu>
      )
      expect(menu()).toHaveAttribute('aria-label', 'Actions for Report.pdf')
      expect(menu()).not.toHaveAttribute('aria-labelledby')
    })

    test("keeps the caller's style", () => {
      // The region's own `-webkit-touch-callout` is a WebKit property, which jsdom drops; the
      // `Default` story checks it in WebKit.
      render(<Subject style={{ padding: 8 }} />)
      expect(region().style.padding).toBe('8px')
    })
  })

  describe('opening', () => {
    test('a right-click opens the menu in place of the browser menu and focuses the first item', () => {
      render(<Subject />)
      const defaultAllowed = rightClick(region())
      expect(defaultAllowed).toBe(false)
      expect(isOpen()).toBe(true)
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus()
    })

    test('a right-click on an element inside the region opens it too', () => {
      render(<Subject />)
      rightClick(screen.getByRole('button', { name: 'Inside' }))
      expect(isOpen()).toBe(true)
    })

    test('Shift+F10 and the context menu key open it from the focused element', () => {
      render(<Subject />)
      const inside = screen.getByRole('button', { name: 'Inside' })

      inside.focus()
      const shiftF10 = fireEvent.keyDown(inside, { key: 'F10', shiftKey: true })
      expect(shiftF10).toBe(false)
      expect(isOpen()).toBe(true)
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus()

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(isOpen()).toBe(false)

      inside.focus()
      fireEvent.keyDown(inside, { key: 'ContextMenu' })
      expect(isOpen()).toBe(true)
    })

    test('the context menu key is prevented on key up too, where Chromium fires `contextmenu`', () => {
      render(<Subject />)
      const inside = screen.getByRole('button', { name: 'Inside' })
      inside.focus()
      expect(fireEvent.keyDown(inside, { key: 'ContextMenu' })).toBe(false)
      expect(fireEvent.keyUp(inside, { key: 'ContextMenu' })).toBe(false)
      expect(fireEvent.keyUp(inside, { key: 'F10', shiftKey: true })).toBe(false)
      expect(fireEvent.keyUp(inside, { key: 'F10' })).toBe(true)
      expect(fireEvent.keyUp(inside, { key: 'Enter' })).toBe(true)
    })

    test("the click a long press's release emits is swallowed, a later click counts", () => {
      const onClick = vi.fn()
      render(
        <ContextMenu data-testid="region">
          Region
          <MenuList>
            <MenuItem onClick={onClick}>Cut</MenuItem>
          </MenuList>
        </ContextMenu>
      )
      fireEvent.pointerDown(region(), { pointerType: 'touch', clientX: 10, clientY: 10 })
      act(() => vi.advanceTimersByTime(500))
      expect(isOpen()).toBe(true)
      fireEvent.pointerUp(region(), { pointerType: 'touch' })

      const cut = screen.getByRole('menuitem', { name: 'Cut' })
      expect(fireEvent.click(cut)).toBe(false)
      expect(onClick).not.toHaveBeenCalled()
      expect(isOpen()).toBe(true)

      act(() => vi.advanceTimersByTime(1000))
      fireEvent.click(cut)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(isOpen()).toBe(false)
    })

    test('selects no text while a finger is down, and restores the region afterwards', () => {
      render(<Subject style={{ userSelect: 'text' }} />)
      expect(region().style.getPropertyValue('user-select')).toBe('text')
      fireEvent.pointerDown(region(), { pointerType: 'touch', clientX: 10, clientY: 10 })
      expect(region().style.getPropertyValue('user-select')).toBe('none')
      fireEvent.pointerCancel(region(), { pointerType: 'touch' })
      expect(region().style.getPropertyValue('user-select')).toBe('text')
    })

    test('F10 without Shift, and other keys, do nothing', () => {
      render(<Subject />)
      const inside = screen.getByRole('button', { name: 'Inside' })
      inside.focus()
      expect(fireEvent.keyDown(inside, { key: 'F10' })).toBe(true)
      expect(fireEvent.keyDown(inside, { key: 'Enter' })).toBe(true)
      expect(isOpen()).toBe(false)
    })

    test('a long press by a finger opens it, a short one or a moving one does not', () => {
      render(<Subject />)
      const target = region()

      fireEvent.pointerDown(target, { pointerType: 'touch', clientX: 10, clientY: 10 })
      act(() => vi.advanceTimersByTime(499))
      fireEvent.pointerUp(target, { pointerType: 'touch' })
      act(() => vi.advanceTimersByTime(100))
      expect(isOpen()).toBe(false)

      fireEvent.pointerDown(target, { pointerType: 'touch', clientX: 10, clientY: 10 })
      fireEvent.pointerMove(target, { pointerType: 'touch', clientX: 10, clientY: 40 })
      act(() => vi.advanceTimersByTime(600))
      expect(isOpen()).toBe(false)

      fireEvent.pointerDown(target, { pointerType: 'touch', clientX: 10, clientY: 10 })
      fireEvent.pointerMove(target, { pointerType: 'touch', clientX: 14, clientY: 14 })
      act(() => vi.advanceTimersByTime(500))
      expect(isOpen()).toBe(true)
    })

    test('a long press by a mouse does not open it', () => {
      render(<Subject />)
      fireEvent.pointerDown(region(), { pointerType: 'mouse', clientX: 10, clientY: 10 })
      act(() => vi.advanceTimersByTime(1000))
      expect(isOpen()).toBe(false)
    })

    test('a long press is cancelled when the pointer leaves or is cancelled', () => {
      render(<Subject />)
      const target = region()

      fireEvent.pointerDown(target, { pointerType: 'touch', clientX: 10, clientY: 10 })
      fireEvent.pointerLeave(target, { pointerType: 'touch' })
      act(() => vi.advanceTimersByTime(600))
      expect(isOpen()).toBe(false)

      fireEvent.pointerDown(target, { pointerType: 'pen', clientX: 10, clientY: 10 })
      fireEvent.pointerCancel(target, { pointerType: 'pen' })
      act(() => vi.advanceTimersByTime(600))
      expect(isOpen()).toBe(false)
    })

    test('the menu is positioned by the pointer, and moved by a second right-click', () => {
      const positions: Array<{ top: number; left: number } | undefined> = []
      const rects = new Map<Element, DOMRect>()
      const getBoundingClientRect = vi
        .spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: Element) {
          return rects.get(this) ?? new DOMRect(0, 0, 0, 0)
        })
      render(<Subject />)
      // A viewport: `useOverlayPosition` keeps the menu inside it, and jsdom's is 0 by 0.
      const root = document.documentElement
      const clientWidth = vi.spyOn(root, 'clientWidth', 'get').mockReturnValue(1000)
      const clientHeight = vi.spyOn(root, 'clientHeight', 'get').mockReturnValue(800)
      rects.set(menu(), new DOMRect(0, 0, 200, 100))

      rightClick(region(), 120, 80)
      settle()
      positions.push({ top: parseFloat(menu().style.top), left: parseFloat(menu().style.left) })

      rightClick(region(), 300, 200)
      settle()
      positions.push({ top: parseFloat(menu().style.top), left: parseFloat(menu().style.left) })

      // The list is a React child of the region, so its events reach the region's handlers
      // through the portal: none of them moves the menu.
      const cut = screen.getByRole('menuitem', { name: 'Cut' })
      expect(fireEvent.contextMenu(cut, { clientX: 500, clientY: 400 })).toBe(false)
      fireEvent.keyDown(cut, { key: 'F10', shiftKey: true })
      fireEvent.pointerDown(cut, { pointerType: 'touch', clientX: 500, clientY: 400 })
      act(() => vi.advanceTimersByTime(600))
      settle()
      positions.push({ top: parseFloat(menu().style.top), left: parseFloat(menu().style.left) })

      expect(positions).toEqual([
        { top: 80, left: 120 },
        { top: 200, left: 300 },
        { top: 200, left: 300 }
      ])
      expect(isOpen()).toBe(true)
      expect(menu()).toHaveAttribute('data-cx-placement', 'bottom-start')
      getBoundingClientRect.mockRestore()
      clientWidth.mockRestore()
      clientHeight.mockRestore()
    })

    test('`disabled` leaves the right-click to the browser', () => {
      render(<Subject disabled />)
      expect(rightClick(region())).toBe(true)
      expect(isOpen()).toBe(false)
      const inside = screen.getByRole('button', { name: 'Inside' })
      inside.focus()
      expect(fireEvent.keyDown(inside, { key: 'F10', shiftKey: true })).toBe(true)
      fireEvent.pointerDown(region(), { pointerType: 'touch', clientX: 10, clientY: 10 })
      act(() => vi.advanceTimersByTime(600))
      expect(isOpen()).toBe(false)
    })

    test('`disabled` with `visible` on mount asks for nothing', () => {
      const onVisibleChange = vi.fn()
      render(<Subject disabled visible onVisibleChange={onVisibleChange} />)
      expect(isOpen()).toBe(true)
      expect(onVisibleChange).not.toHaveBeenCalled()
    })

    test('becoming `disabled` closes an open menu', () => {
      const { rerender } = render(<Subject />)
      rightClick(region())
      expect(isOpen()).toBe(true)
      rerender(<Subject disabled />)
      expect(isOpen()).toBe(false)
    })

    test('`defaultVisible` opens it at first, under the region', () => {
      render(<Subject defaultVisible />)
      expect(isOpen()).toBe(true)
      expect(menu()).toHaveAttribute('data-cx-placement', 'bottom-start')
    })
  })

  describe('closing', () => {
    test('Escape closes it and returns focus to the element that had it', () => {
      render(<Subject />)
      const inside = screen.getByRole('button', { name: 'Inside' })
      inside.focus()
      rightClick(region())
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus()

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(isOpen()).toBe(false)
      expect(inside).toHaveFocus()
    })

    test('a click on an item closes it and returns focus', () => {
      const onClick = vi.fn()
      render(
        <ContextMenu data-testid="region">
          <button type="button">Inside</button>
          <MenuList>
            <MenuItem onClick={onClick}>Cut</MenuItem>
          </MenuList>
        </ContextMenu>
      )
      const inside = screen.getByRole('button', { name: 'Inside' })
      inside.focus()
      rightClick(region())
      settle()

      fireEvent.click(screen.getByRole('menuitem', { name: 'Cut' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(isOpen()).toBe(false)
      expect(inside).toHaveFocus()
    })

    test('a press outside closes it, and leaves focus where the press puts it', () => {
      render(
        <>
          <Subject />
          <button type="button">Elsewhere</button>
        </>
      )
      const elsewhere = screen.getByRole('button', { name: 'Elsewhere' })
      rightClick(region())
      settle()

      fireEvent.pointerDown(elsewhere, { button: 0 })
      elsewhere.focus()
      expect(isOpen()).toBe(false)
      expect(elsewhere).toHaveFocus()
    })

    test('a left press on the region closes it, a right press on the region does not', () => {
      render(<Subject />)
      rightClick(region())
      settle()

      fireEvent.pointerDown(region(), { button: 2 })
      expect(isOpen()).toBe(true)

      fireEvent.pointerDown(region(), { button: 0 })
      expect(isOpen()).toBe(false)
    })

    test('a press inside the menu, or inside a submenu, does not close it', () => {
      render(
        <ContextMenu data-testid="region">
          Region
          <MenuList>
            <MenuItem>Cut</MenuItem>
            <MenuSubmenu trigger="Share">
              <MenuItem>Mail</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </ContextMenu>
      )
      rightClick(screen.getByText('Region'))
      settle()

      fireEvent.pointerDown(screen.getByRole('menuitem', { name: 'Cut' }), { button: 0 })
      expect(isOpen()).toBe(true)

      fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }))
      const nested = screen.getByRole('menuitem', { name: 'Mail' })
      fireEvent.pointerDown(nested, { button: 0 })
      expect(isOpen()).toBe(true)

      fireEvent.click(nested)
      expect(isOpen()).toBe(false)
    })

    test('a form control inside the menu is used in place', () => {
      render(
        <ContextMenu data-testid="region">
          Region
          <MenuList>
            <form>
              <input aria-label="Name" />
            </form>
          </MenuList>
        </ContextMenu>
      )
      rightClick(screen.getByText('Region'))
      settle()
      fireEvent.click(screen.getByRole('textbox', { name: 'Name' }))
      expect(isOpen()).toBe(true)
    })

    test('Tab out of the menu closes it', () => {
      render(
        <>
          <Subject />
          <button type="button">Elsewhere</button>
        </>
      )
      rightClick(region())
      settle()
      const elsewhere = screen.getByRole('button', { name: 'Elsewhere' })
      elsewhere.focus()
      fireEvent.keyUp(elsewhere, { key: 'Tab' })
      expect(isOpen()).toBe(false)
    })

    test('`autoClose={false}` leaves closing to Escape', () => {
      render(<Subject autoClose={false} />)
      rightClick(region())
      settle()
      fireEvent.pointerDown(document.body, { button: 0 })
      fireEvent.click(screen.getByRole('menuitem', { name: 'Cut' }))
      expect(isOpen()).toBe(true)
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(isOpen()).toBe(false)
    })

    test("`autoClose='inside'` closes on an item only", () => {
      render(<Subject autoClose="inside" />)
      rightClick(region())
      settle()
      fireEvent.pointerDown(document.body, { button: 0 })
      expect(isOpen()).toBe(true)
      fireEvent.click(screen.getByRole('menuitem', { name: 'Cut' }))
      expect(isOpen()).toBe(false)
    })

    test("`autoClose='outside'` closes on a press outside only", () => {
      render(<Subject autoClose="outside" />)
      rightClick(region())
      settle()
      fireEvent.click(screen.getByRole('menuitem', { name: 'Cut' }))
      expect(isOpen()).toBe(true)
      fireEvent.pointerDown(document.body, { button: 0 })
      expect(isOpen()).toBe(false)
    })

    test('closing through `visible` while focus is elsewhere leaves focus there', () => {
      const Controlled = () => {
        const [visible, setVisible] = React.useState(false)
        return (
          <>
            <Subject visible={visible} onVisibleChange={setVisible} />
            <button type="button" onClick={() => setVisible(false)}>
              Close it
            </button>
          </>
        )
      }
      render(<Controlled />)
      rightClick(region())
      settle()
      expect(isOpen()).toBe(true)

      const closeIt = screen.getByRole('button', { name: 'Close it' })
      closeIt.focus()
      // Not a press: only the button's own click, so the outside-press dismissal stays out of it.
      fireEvent.click(closeIt)
      expect(isOpen()).toBe(false)
      expect(closeIt).toHaveFocus()
    })
  })

  describe('events', () => {
    test('reports `onShow`, `onHide` and `onVisibleChange`', () => {
      const onShow = vi.fn()
      const onHide = vi.fn()
      const onVisibleChange = vi.fn()
      render(<Subject onShow={onShow} onHide={onHide} onVisibleChange={onVisibleChange} />)
      expect(onHide).not.toHaveBeenCalled()

      rightClick(region())
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenLastCalledWith(true)

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenLastCalledWith(false)
    })

    test("chains the caller's handlers after its own", () => {
      const onContextMenu = vi.fn()
      const onKeyDown = vi.fn()
      render(<Subject onContextMenu={onContextMenu} onKeyDown={onKeyDown} />)
      rightClick(region())
      expect(onContextMenu).toHaveBeenCalledTimes(1)
      expect(isOpen()).toBe(true)
      fireEvent.keyDown(region(), { key: 'a' })
      expect(onKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('in a dialog', () => {
    test('portals the list into the open dialog around the region', () => {
      render(
        <dialog open>
          <Subject />
        </dialog>
      )
      rightClick(region())
      settle()
      expect(isOpen()).toBe(true)
      expect(screen.getByRole('dialog')).toContainElement(menu())
    })
  })

  describe('list content', () => {
    test("renders Menu's headers, dividers and data-driven items", () => {
      render(
        <ContextMenu data-testid="region">
          Region
          <MenuList
            items={[
              { type: 'header', id: 'h', label: 'File' },
              { type: 'item', id: 'open', label: 'Open' },
              { type: 'divider', id: 'd' },
              { type: 'item', id: 'delete', label: 'Delete', disabled: true }
            ]}
          />
        </ContextMenu>
      )
      rightClick(screen.getByText('Region'))
      expect(screen.getByText('File')).toHaveClass('menu-header')
      expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus()
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeDisabled()
    })

    test('arrow keys move between the items', () => {
      render(<Subject />)
      rightClick(region())
      const cut = screen.getByRole('menuitem', { name: 'Cut' })
      const copy = screen.getByRole('menuitem', { name: 'Copy' })
      expect(cut).toHaveFocus()
      fireEvent.keyDown(cut, { key: 'ArrowDown' })
      expect(copy).toHaveFocus()
      fireEvent.keyDown(copy, { key: 'End' })
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations, open, with a header, a divider and items', async () => {
      vi.useRealTimers()
      const { container } = render(
        <ContextMenu data-testid="region">
          <p>Files</p>
          <MenuList>
            <MenuHeader>Report.pdf</MenuHeader>
            <MenuItem>Open</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuDivider />
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </ContextMenu>
      )
      rightClick(screen.getByText('Files'))
      expect(isOpen()).toBe(true)
      // The list is portaled to the body: checked there, without the page-landmark rule a
      // fragment of a page can't satisfy.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
