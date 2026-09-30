import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { MockInstance } from 'vitest'

import {
  Alert,
  AlertCancel,
  AlertTitle,
  Button,
  ContextMenu,
  DatePicker,
  DateRangePicker,
  Drawer,
  Link,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Modal,
  Notification,
  Popover,
  Toast,
  Tooltip
} from '../../src/index'

// One rule for every component that can show and hide itself (CONVENTIONS.md, "Open state"):
// `visible` is controlled, `defaultVisible` is the initial state of an uncontrolled component,
// and `onVisibleChange` reports each change the component asks for. Each component below gets
// the same cases, driven through what a user does to it.
interface StateProps {
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visible?: boolean
}

interface Subject {
  name: string
  element: (props: StateProps) => React.ReactElement
  isShown: () => boolean
  /** What a user does to open it. A component with no trigger of its own has none. */
  askToShow?: () => void
  /** What a user does to close it. */
  askToHide: () => void
  /**
   * Whether a dropped request warns. `Modal` and `Drawer` don't: `visible` with `onClose` alone
   * is their usual, complete pairing.
   */
  warnsWhenDropped: boolean
}

// react-aria only treats a hover as pointer-triggered once it has seen a real pointer event.
const hoverOver = (target: HTMLElement) => {
  fireEvent.pointerMove(document.body)
  fireEvent.pointerEnter(target)
}

const cancel = () =>
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
const expanded = (name: string | RegExp) =>
  screen.getByRole('button', { name }).getAttribute('aria-expanded') === 'true'

const SUBJECTS: Subject[] = [
  {
    name: 'Popover',
    element: (props) => (
      <Popover aria-label="Details" content="Body" {...props}>
        <Button>Trigger</Button>
      </Popover>
    ),
    isShown: () => screen.queryByRole('dialog') !== null,
    askToShow: () => fireEvent.click(screen.getByRole('button', { name: 'Trigger' })),
    askToHide: () => fireEvent.keyDown(window, { key: 'Escape' }),
    warnsWhenDropped: true
  },
  {
    name: 'Tooltip',
    element: (props) => (
      <Tooltip content="Tip" {...props}>
        <Link href="#">Trigger</Link>
      </Tooltip>
    ),
    isShown: () => screen.queryByRole('tooltip') !== null,
    askToShow: () => hoverOver(screen.getByRole('link', { name: 'Trigger' })),
    askToHide: () => {
      const trigger = screen.getByRole('link', { name: 'Trigger' })
      hoverOver(trigger)
      fireEvent.pointerLeave(trigger)
    },
    warnsWhenDropped: true
  },
  {
    name: 'Menu',
    element: (props) => (
      <Menu {...props}>
        <MenuToggle>Toggle</MenuToggle>
        <MenuList>
          <MenuItem>Item</MenuItem>
        </MenuList>
      </Menu>
    ),
    isShown: () => expanded('Toggle'),
    askToShow: () => fireEvent.click(screen.getByRole('button', { name: 'Toggle' })),
    askToHide: () => fireEvent.keyDown(window, { key: 'Escape' }),
    warnsWhenDropped: true
  },
  {
    name: 'ContextMenu',
    element: (props) => (
      <ContextMenu {...props}>
        Region
        <MenuList>
          <MenuItem>Item</MenuItem>
        </MenuList>
      </ContextMenu>
    ),
    isShown: () => screen.getByRole('menu', { hidden: true }).classList.contains('show'),
    askToShow: () =>
      fireEvent.contextMenu(screen.getByText('Region'), { clientX: 10, clientY: 10 }),
    askToHide: () => fireEvent.keyDown(window, { key: 'Escape' }),
    warnsWhenDropped: true
  },
  {
    name: 'Alert',
    element: (props) => (
      <Alert {...props}>
        <AlertTitle>Alert</AlertTitle>
        <AlertCancel>Cancel</AlertCancel>
      </Alert>
    ),
    isShown: () => screen.queryByRole('alertdialog') !== null,
    askToHide: () => fireEvent.click(screen.getByRole('button', { name: 'Cancel' })),
    warnsWhenDropped: false
  },
  {
    name: 'Modal',
    element: (props) => (
      <Modal aria-label="Modal" {...props}>
        Body
      </Modal>
    ),
    isShown: () => screen.queryByRole('dialog') !== null,
    askToHide: cancel,
    warnsWhenDropped: false
  },
  {
    name: 'Drawer',
    element: (props) => (
      <Drawer aria-label="Drawer" placement="start" {...props}>
        Body
      </Drawer>
    ),
    isShown: () => screen.queryByRole('dialog') !== null,
    askToHide: cancel,
    warnsWhenDropped: false
  },
  {
    name: 'Toast',
    element: (props) => <Toast autohide={false} closeButton message="Saved" {...props} />,
    isShown: () => screen.queryByRole('status') !== null,
    askToHide: () => fireEvent.click(screen.getByRole('button', { name: 'Close' })),
    warnsWhenDropped: true
  },
  {
    name: 'Notification',
    element: (props) => <Notification dismissible text="Saved" {...props} />,
    isShown: () => screen.queryByRole('status') !== null,
    askToHide: () => fireEvent.click(screen.getByRole('button', { name: 'Close' })),
    warnsWhenDropped: true
  },
  {
    name: 'DatePicker',
    element: (props) => <DatePicker aria-label="Event date" {...props} />,
    isShown: () => expanded(/calendar/i),
    askToShow: () => fireEvent.click(screen.getByRole('button', { name: /calendar/i })),
    askToHide: () => fireEvent.click(screen.getByRole('button', { name: /calendar/i })),
    warnsWhenDropped: true
  },
  {
    name: 'DateRangePicker',
    element: (props) => <DateRangePicker aria-label="Trip dates" {...props} />,
    isShown: () => expanded(/calendar/i),
    askToShow: () => fireEvent.click(screen.getByRole('button', { name: /calendar/i })),
    askToHide: () => fireEvent.click(screen.getByRole('button', { name: /calendar/i })),
    warnsWhenDropped: true
  }
]

// Transitions end on a timer in jsdom, and outside-click listeners are attached on one.
const settle = () => {
  act(() => vi.runAllTimers())
  act(() => vi.runAllTimers())
}

describe.each(SUBJECTS)('open state of $name', (subject) => {
  const { askToHide, askToShow, element, isShown, name } = subject
  let warn: MockInstance<typeof console.warn>

  beforeEach(() => {
    vi.useFakeTimers()
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const droppedRequests = () =>
    warn.mock.calls.filter(([message]) => String(message).includes('`onVisibleChange`'))

  test('`visible` holds it shown: a request to hide is reported and changes nothing', () => {
    const onVisibleChange = vi.fn()
    render(element({ onVisibleChange, visible: true }))
    settle()
    expect(isShown()).toBe(true)

    askToHide()
    settle()
    expect(isShown()).toBe(true)
    expect(onVisibleChange).toHaveBeenCalledWith(false)
    expect(onVisibleChange).not.toHaveBeenCalledWith(true)
    expect(droppedRequests()).toEqual([])
  })

  test('`visible` follows the prop', () => {
    const { rerender } = render(element({ visible: false }))
    settle()
    expect(isShown()).toBe(false)

    rerender(element({ visible: true }))
    settle()
    expect(isShown()).toBe(true)

    rerender(element({ visible: false }))
    settle()
    expect(isShown()).toBe(false)
  })

  test('`visible` with a state setter as `onVisibleChange` follows every request', () => {
    const Controlled = () => {
      const [visible, setVisible] = React.useState(!askToShow)
      return element({ onVisibleChange: setVisible, visible })
    }
    render(<Controlled />)
    settle()

    if (askToShow) {
      expect(isShown()).toBe(false)
      askToShow()
      settle()
    }
    expect(isShown()).toBe(true)

    askToHide()
    settle()
    expect(isShown()).toBe(false)
    expect(droppedRequests()).toEqual([])
  })

  test('`defaultVisible` shows it at first, and it hides itself', () => {
    const onVisibleChange = vi.fn()
    render(element({ defaultVisible: true, onVisibleChange }))
    settle()
    expect(isShown()).toBe(true)

    askToHide()
    settle()
    expect(isShown()).toBe(false)
    expect(onVisibleChange).toHaveBeenCalledTimes(1)
    expect(onVisibleChange).toHaveBeenCalledWith(false)
  })

  test.runIf(askToShow)('`visible={false}` holds it hidden against its own trigger', () => {
    const onVisibleChange = vi.fn()
    render(element({ onVisibleChange, visible: false }))
    settle()

    askToShow!()
    settle()
    expect(isShown()).toBe(false)
    expect(onVisibleChange).toHaveBeenCalledWith(true)
  })

  test.runIf(askToShow)('with neither prop it shows and hides itself, and reports both', () => {
    const onVisibleChange = vi.fn()
    render(element({ onVisibleChange }))
    settle()
    expect(isShown()).toBe(false)

    askToShow!()
    settle()
    expect(isShown()).toBe(true)

    askToHide()
    settle()
    expect(isShown()).toBe(false)
    expect(onVisibleChange.mock.calls).toEqual([[true], [false]])
  })

  test(`a request dropped for lack of \`onVisibleChange\` ${
    subject.warnsWhenDropped ? 'warns once' : 'does not warn'
  }`, () => {
    render(element({ visible: true }))
    settle()

    askToHide()
    settle()
    askToHide()
    settle()
    expect(isShown()).toBe(true)

    if (subject.warnsWhenDropped) {
      expect(droppedRequests()).toHaveLength(1)
      expect(droppedRequests()[0]![0]).toContain(`${name}: asked to hide`)
    } else {
      expect(droppedRequests()).toEqual([])
    }
  })
})

describe('deprecated open-state names of the date pickers', () => {
  test.each([
    ['DatePicker', DatePicker],
    ['DateRangePicker', DateRangePicker]
  ] as const)('%s still takes isOpen/defaultOpen/onOpenChange, and warns', (name, Picker) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onOpenChange = vi.fn()
    const onVisibleChange = vi.fn()
    const { rerender } = render(
      <Picker
        aria-label="Date"
        isOpen={false}
        onOpenChange={onOpenChange}
        onVisibleChange={onVisibleChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
    expect(expanded(/calendar/i)).toBe(false)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(onVisibleChange).toHaveBeenCalledWith(true)

    rerender(<Picker aria-label="Date" isOpen onOpenChange={onOpenChange} />)
    expect(expanded(/calendar/i)).toBe(true)

    // `visible` wins over the deprecated name.
    rerender(<Picker aria-label="Date" isOpen visible={false} />)
    expect(expanded(/calendar/i)).toBe(false)

    const messages = warn.mock.calls.map(([message]) => String(message))
    expect(messages).toContain(
      `${name}: the isOpen prop is deprecated, use visible instead. It will be removed in a future major version.`
    )
    expect(messages).toContain(
      `${name}: the onOpenChange prop is deprecated, use onVisibleChange instead. It will be removed in a future major version.`
    )
    warn.mockRestore()
  })

  test('defaultOpen still sets the initial state', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<DatePicker aria-label="Date" defaultOpen />)
    expect(expanded(/calendar/i)).toBe(true)
    expect(warn).toHaveBeenCalledWith(
      'DatePicker: the defaultOpen prop is deprecated, use defaultVisible instead. It will be removed in a future major version.'
    )
    warn.mockRestore()
  })
})
