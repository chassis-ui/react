import {
  focusMenuItem,
  getMenuItems,
  handleMenuKeyDown
} from '../../../src/components/menu/menuNavigation'

// jsdom never runs real layout, so `isVisible`'s offsetWidth/offsetHeight/getClientRects check
// always reads 0 for every element — stub a non-zero offsetHeight so these unit tests exercise
// real items instead of an always-empty filtered list (see Menu.spec.tsx for the same rationale).
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
})
afterEach(() => {
  vi.restoreAllMocks()
})

const makeMenu = (html: string): HTMLElement => {
  const menu = document.createElement('div')
  menu.innerHTML = html
  document.body.appendChild(menu)
  return menu
}

const keyEvent = (key: string, { currentTarget }: { currentTarget: HTMLElement }) =>
  ({
    key,
    target: currentTarget,
    currentTarget,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

describe('getMenuItems', () => {
  test('returns an empty array for a null menu', () => {
    expect(getMenuItems(null)).toEqual([])
  })

  test('includes a submenu trigger nested one level inside .submenu, but not the wrapper itself', () => {
    const menu = makeMenu(`
      <button class="menu-item">A</button>
      <div class="submenu">
        <button class="menu-item">Trigger</button>
      </div>
    `)
    const items = getMenuItems(menu)
    expect(items.map((item) => item.textContent)).toEqual(['A', 'Trigger'])
  })

  test('excludes disabled items', () => {
    const menu = makeMenu(`
      <button class="menu-item">A</button>
      <button class="menu-item disabled">B</button>
    `)
    expect(getMenuItems(menu).map((item) => item.textContent)).toEqual(['A'])
  })
})

describe('focusMenuItem', () => {
  test('is a no-op for an empty list', () => {
    expect(() => focusMenuItem([], 'first')).not.toThrow()
  })
})

describe('handleMenuKeyDown', () => {
  test('Escape is a no-op when onEscape is not provided', () => {
    const menu = makeMenu('<button class="menu-item">A</button>')
    const event = keyEvent('Escape', { currentTarget: menu })
    handleMenuKeyDown(event, {})
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('ArrowLeft is a no-op when onArrowLeft is not provided', () => {
    const menu = makeMenu('<button class="menu-item">A</button>')
    const event = keyEvent('ArrowLeft', { currentTarget: menu })
    handleMenuKeyDown(event, {})
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('ArrowRight is a no-op when onArrowRight is not provided', () => {
    const menu = makeMenu('<button class="menu-item">A</button>')
    const event = keyEvent('ArrowRight', { currentTarget: menu })
    handleMenuKeyDown(event, {})
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('an unhandled key is a no-op', () => {
    const menu = makeMenu('<button class="menu-item">A</button>')
    const event = keyEvent('a', { currentTarget: menu })
    expect(() => handleMenuKeyDown(event, {})).not.toThrow()
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('ArrowDown/Up on an empty menu is a no-op', () => {
    const menu = makeMenu('')
    const event = keyEvent('ArrowDown', { currentTarget: menu })
    handleMenuKeyDown(event, {})
    expect((document.activeElement as HTMLElement).tagName).not.toBe('BUTTON')
  })
})
