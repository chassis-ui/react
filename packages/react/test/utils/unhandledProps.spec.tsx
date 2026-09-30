import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Checkbox,
  CheckboxGroup,
  NumberField,
  Radio,
  RadioGroup,
  SearchField,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  TextInput
} from '../../src/index'

// A react-aria hook returns only the few DOM props it knows, so every component below used to
// drop the global attributes and event handlers its props type accepts: `title`, `dir`, `onClick`,
// `tabIndex` and the rest never reached the element (`mergeUnhandledProps`,
// `src/utils/unhandledProps.ts`). Each gets the same cases.

const getByClass = (className: string) =>
  screen.getByText((_, element) => element?.classList.contains(className) ?? false)

interface Subject {
  name: string
  element: (props: Record<string, unknown>) => React.ReactElement
  control: () => HTMLElement
  /** The element that carries `className`, and so `style` too, when it isn't the control. */
  outermost?: () => HTMLElement
}

const subjects: Subject[] = [
  {
    name: 'TextInput',
    element: (props) => <TextInput label="Field" {...props} />,
    control: () => screen.getByRole('textbox', { name: 'Field' })
  },
  {
    name: 'TextInput with an adorn',
    element: (props) => <TextInput adornEnd="kg" label="Field" {...props} />,
    control: () => screen.getByRole('textbox', { name: 'Field' }),
    outermost: () => getByClass('form-input')
  },
  {
    name: 'Textarea',
    element: (props) => <Textarea label="Field" {...props} />,
    control: () => screen.getByRole('textbox', { name: 'Field' })
  },
  {
    name: 'NumberField',
    element: (props) => <NumberField label="Field" {...props} />,
    control: () => screen.getByRole('textbox', { name: 'Field' }),
    outermost: () => getByClass('number-field')
  },
  {
    name: 'SearchField',
    element: (props) => <SearchField label="Field" {...props} />,
    control: () => screen.getByRole('searchbox', { name: 'Field' }),
    outermost: () => getByClass('search-field')
  },
  {
    name: 'Checkbox',
    element: (props) => <Checkbox label="Field" {...props} />,
    control: () => screen.getByRole('checkbox', { name: 'Field' }),
    outermost: () => getByClass('form-check')
  },
  {
    name: 'Checkbox in a CheckboxGroup',
    element: (props) => (
      <CheckboxGroup label="Group">
        <Checkbox label="Field" value="a" {...props} />
      </CheckboxGroup>
    ),
    control: () => screen.getByRole('checkbox', { name: 'Field' }),
    outermost: () => getByClass('form-check')
  },
  {
    name: 'Radio',
    element: (props) => (
      <RadioGroup label="Group">
        <Radio label="Field" value="a" {...props} />
      </RadioGroup>
    ),
    control: () => screen.getByRole('radio', { name: 'Field' }),
    outermost: () => getByClass('form-check')
  },
  {
    name: 'Switch',
    element: (props) => <Switch label="Field" {...props} />,
    control: () => screen.getByRole('switch', { name: 'Field' }),
    outermost: () => getByClass('form-switch')
  },
  {
    name: 'Switch of type radio',
    element: (props) => <Switch label="Field" type="radio" {...props} />,
    control: () => screen.getByRole('switch', { name: 'Field' }),
    outermost: () => getByClass('form-switch')
  }
]

describe.each(subjects)('$name', ({ control, element, outermost }) => {
  test('renders the global attributes it is given', () => {
    render(
      element({
        accessKey: 'f',
        'aria-keyshortcuts': 'Alt+F',
        'data-testid': 'field',
        dir: 'rtl',
        lang: 'fr',
        title: 'A field',
        translate: 'no'
      })
    )
    const field = control()
    expect(field).toHaveAttribute('accesskey', 'f')
    expect(field).toHaveAttribute('aria-keyshortcuts', 'Alt+F')
    expect(field).toHaveAttribute('data-testid', 'field')
    expect(field).toHaveAttribute('dir', 'rtl')
    expect(field).toHaveAttribute('lang', 'fr')
    expect(field).toHaveAttribute('title', 'A field')
    expect(field).toHaveAttribute('translate', 'no')
  })

  test('runs each event handler it is given once', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onFocus = vi.fn()
    const onKeyDown = vi.fn()
    const onMouseEnter = vi.fn()
    render(element({ onClick, onFocus, onKeyDown, onMouseEnter }))

    await user.hover(control())
    await user.click(control())
    await user.keyboard('{Shift}')

    expect(onMouseEnter).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  test('puts style on the outermost element', () => {
    render(element({ style: { maxWidth: '10rem' } }))
    expect((outermost ?? control)()).toHaveAttribute('style', 'max-width: 10rem;')
  })
})

describe.each(subjects.filter(({ outermost }) => outermost))('$name', ({ control, element }) => {
  test('leaves style off the control inside it', () => {
    render(element({ style: { maxWidth: '10rem' } }))
    expect(control()).not.toHaveAttribute('style')
  })
})

describe.each(subjects.filter(({ name }) => name !== 'Radio'))('$name', ({ control, element }) => {
  test('takes the tabIndex it is given', () => {
    render(element({ tabIndex: -1 }))
    expect(control()).toHaveAttribute('tabindex', '-1')
  })
})

describe.each(['TextInput', 'TextInput with an adorn', 'Textarea', 'NumberField', 'SearchField'])(
  '%s',
  (name) => {
    const { element } = subjects.find((subject) => subject.name === name)!

    test('keeps its own label and help next to the ones it is given', () => {
      render(
        <>
          <span id="unit">in metres</span>
          <span id="note">Measured at noon</span>
          {element({ 'aria-describedby': 'note', 'aria-labelledby': 'unit', help: 'Rounded' })}
        </>
      )
      const field = screen.getByRole(name === 'SearchField' ? 'searchbox' : 'textbox')
      expect(field).toHaveAccessibleName('Field in metres')
      expect(field).toHaveAccessibleDescription('Rounded Measured at noon')
    })
  }
)

describe('TextInput', () => {
  test('takes the autoComplete it is given', () => {
    render(<TextInput autoComplete="postal-code" label="Field" />)
    expect(screen.getByRole('textbox', { name: 'Field' })).toHaveAttribute(
      'autocomplete',
      'postal-code'
    )
  })
})

describe('NumberField', () => {
  test("turns the browser's autocomplete off unless it is given one", () => {
    render(
      <>
        <NumberField label="Default" />
        <NumberField autoComplete="cc-exp-year" label="Given" />
      </>
    )
    expect(screen.getByRole('textbox', { name: 'Default' })).toHaveAttribute('autocomplete', 'off')
    expect(screen.getByRole('textbox', { name: 'Given' })).toHaveAttribute(
      'autocomplete',
      'cc-exp-year'
    )
  })
})

describe('Radio', () => {
  test("keeps the group's name and tab stop", () => {
    render(
      <RadioGroup defaultValue="b" label="Group" name="size">
        <Radio label="A" name="other" tabIndex={0} value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>
    )
    const [a, b] = screen.getAllByRole('radio')
    expect(a).toHaveAttribute('name', 'size')
    expect(a).toHaveAttribute('tabindex', '-1')
    expect(b).toHaveAttribute('tabindex', '0')
  })
})

describe('RadioGroup', () => {
  test('runs the onKeyDown it is given and still moves the selection', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(
      <RadioGroup label="Group" onKeyDown={onKeyDown}>
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>
    )
    await user.click(screen.getByRole('radio', { name: 'A' }))
    await user.keyboard('{ArrowDown}')

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked()
  })
})

describe('TabList', () => {
  test('renders the aria attributes it is given', () => {
    render(
      <Tabs>
        <TabList aria-busy aria-label="Sections" aria-roledescription="section switcher">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanel id="a">Content</TabPanel>
      </Tabs>
    )
    const list = screen.getByRole('tablist', { name: 'Sections' })
    expect(list).toHaveAttribute('aria-busy', 'true')
    expect(list).toHaveAttribute('aria-roledescription', 'section switcher')
  })
})
