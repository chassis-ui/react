import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import {
  Autocomplete,
  AutocompleteItem,
  Combobox,
  ComboboxItem,
  ContextMenu,
  Menu,
  MenuItem,
  MenuList,
  MenuSubmenu,
  MenuToggle
} from '../../src/index'
import { useOverlayMaxHeight } from '../../src/hooks/useOverlayMaxHeight'

// react-aria's `useOverlayPosition` writes the room it finds for an overlay as an inline
// `max-height` on the element, which outranks chassis-css's `--cx-menu-max-height` on `.menu`. The
// panels of these components keep it only where it is the smaller of the two
// (`useOverlayMaxHeight`). In jsdom nothing has a size, so the room it writes is the viewport's.
//
// The `.menu` wrapper of a combobox's list has no role of its own (`Combobox.spec.tsx`).
const comboboxPanel = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.menu') as HTMLElement

// chassis-css's cap on `.menu`, resolved: jsdom reads no `var()` in a computed `max-height`.
let sheet: HTMLStyleElement | undefined
const themeCap = (value: string) => {
  sheet = document.createElement('style')
  sheet.textContent = `.menu { max-height: ${value}; }`
  document.head.append(sheet)
}
afterEach(() => {
  sheet?.remove()
  sheet = undefined
})

const resize = async () => {
  await act(async () => {
    window.dispatchEvent(new Event('resize'))
  })
}

describe('useOverlayMaxHeight', () => {
  beforeEach(() => themeCap('320px'))

  test("a Menu's list keeps the room where the theme has no cap, and scrolls inside it", () => {
    sheet?.remove()
    render(
      <Menu visible>
        <MenuToggle>Menu</MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )
    expect(screen.getByRole('menu').style.maxHeight).toMatch(/px$/)
    expect(screen.getByRole('menu').style.overflowY).toBe('auto')
  })

  test("a Menu's list has no inline max-height over a smaller cap, opened or placed again", async () => {
    render(
      <Menu visible>
        <MenuToggle>Menu</MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
    await resize()
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
  })

  test("a MenuSubmenu's panel has no inline max-height over a smaller cap", () => {
    vi.useFakeTimers()
    render(
      <Menu visible>
        <MenuToggle>Menu</MenuToggle>
        <MenuList>
          <MenuSubmenu activation="click" trigger="More">
            <MenuItem>Nested</MenuItem>
          </MenuSubmenu>
        </MenuList>
      </Menu>
    )
    fireEvent.click(screen.getByRole('menuitem', { name: 'More' }))
    act(() => vi.runAllTimers())
    const panel = screen.getByRole('menu', { name: 'More' })
    expect(panel).toHaveClass('show')
    expect(panel.style.maxHeight).toBe('')
    vi.useRealTimers()
  })

  test("a ContextMenu's list has no inline max-height over a smaller cap", () => {
    render(
      <ContextMenu visible>
        <span>Region</span>
        <MenuList>
          <MenuItem>Cut</MenuItem>
        </MenuList>
      </ContextMenu>
    )
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
  })

  test("a Combobox's list keeps the theme's cap, with no inline max-height over it", async () => {
    render(
      <Combobox aria-label="Fruit">
        <ComboboxItem id="apple">Apple</ComboboxItem>
      </Combobox>
    )
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Fruit' }), { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(comboboxPanel().style.maxHeight).toBe('')
    expect(comboboxPanel().style.getPropertyValue('--cx-menu-max-height')).toBe('320px')
    await resize()
    expect(comboboxPanel().style.maxHeight).toBe('')
  })

  test("an Autocomplete's list has no inline max-height over a smaller cap", () => {
    render(
      <Autocomplete aria-label="Fruit">
        <AutocompleteItem id="apple">Apple</AutocompleteItem>
      </Autocomplete>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(comboboxPanel().style.maxHeight).toBe('')
  })
})

// The hook on its own, with the room written as react-aria writes it: on the element, after it
// mounts, and again each time it places the panel.
function Panel({ open = true }: { open?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  useOverlayMaxHeight(ref, open)
  return <div ref={ref} className="menu" data-testid="panel" />
}

const placeWithRoom = async (room: string) => {
  await act(async () => {
    screen.getByTestId('panel').style.maxHeight = room
  })
}

describe('useOverlayMaxHeight, against the theme cap', () => {
  test('keeps the room where the theme has no cap, and scrolls inside it', async () => {
    render(<Panel />)
    await placeWithRoom('341px')
    const panel = screen.getByTestId('panel')
    expect(panel.style.maxHeight).toBe('341px')
    expect(panel.style.overflowY).toBe('auto')
  })

  test('keeps the room where it is smaller than the theme cap', async () => {
    themeCap('320px')
    render(<Panel />)
    await placeWithRoom('200px')
    const panel = screen.getByTestId('panel')
    expect(panel.style.maxHeight).toBe('200px')
    expect(panel.style.overflowY).toBe('auto')
  })

  test('takes the room off where the theme cap is smaller, and leaves it the overflow', async () => {
    themeCap('320px')
    render(<Panel />)
    await placeWithRoom('360.5px')
    const panel = screen.getByTestId('panel')
    expect(panel.style.maxHeight).toBe('')
    expect(panel.style.overflowY).toBe('')
  })

  test('follows the room as the panel is placed again', async () => {
    themeCap('320px')
    render(<Panel />)
    await placeWithRoom('200px')
    await placeWithRoom('500px')
    const panel = screen.getByTestId('panel')
    expect(panel.style.maxHeight).toBe('')
    expect(panel.style.overflowY).toBe('')
    await placeWithRoom('150px')
    expect(panel.style.maxHeight).toBe('150px')
    expect(panel.style.overflowY).toBe('auto')
  })
})
