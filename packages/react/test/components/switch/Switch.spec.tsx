import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Switch } from '../../../src/index'

describe('Switch', () => {
  describe('rendering', () => {
    test('renders role="switch" for the checkbox-backed default type', () => {
      render(<Switch aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    test('takes its accessible name from children when no label prop is given', () => {
      render(<Switch>Notifications</Switch>)
      expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })

    // The radio-backed variant is hand-wired rather than react-aria-backed, and spreads its rest
    // props straight onto the `<input>` — so children did not merely vanish here, they reached a
    // void element and React threw.
    test('takes its accessible name from children for the radio-backed variant too', () => {
      render(<Switch type="radio">Notifications</Switch>)
      expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument()
    })

    test('prefers the label prop when both label and children are given', () => {
      render(<Switch label="From label">From children</Switch>)
      expect(screen.getByRole('switch', { name: 'From label' })).toBeInTheDocument()
      expect(screen.queryByText('From children')).not.toBeInTheDocument()
    })

    test('renders a bare check-input span, not an empty label wrapper, when unlabeled', () => {
      render(<Switch aria-label="Notifications" />)
      const input = screen.getByRole('switch')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.parentElement).toHaveClass('check-input')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('label')).toBeNull()
      expect(input).toHaveAttribute('type', 'checkbox')
      expect(input).toHaveAttribute('data-react-aria-pressable', 'true')
      expect(input).toHaveAttribute('tabindex', '0')
    })
  })

  describe('styling props', () => {
    // With no label there is no `.form-check`, and `className` was dropped with it while `style`
    // went to the `.check-input`.
    test.each(['checkbox', 'radio'] as const)(
      'a %s-backed switch with no label takes className and style on its check input',
      (type) => {
        render(<Switch aria-label="Wi-Fi" className="bazinga" style={{ margin: 4 }} type={type} />)
        const checkInput = screen.getByText(
          (_, element) => element?.classList.contains('check-input') ?? false
        )
        expect(checkInput).toHaveClass('check-input', 'bazinga')
        expect(checkInput).toHaveStyle({ margin: '4px' })
        expect(checkInput).toContainElement(screen.getByRole('switch', { name: 'Wi-Fi' }))
      }
    )

    test('applies color, size, invalid/valid classes together, as a radio-backed switch', () => {
      render(
        <Switch
          className="bazinga"
          color="secondary"
          id="2"
          invalid={true}
          label="Some label"
          size="lg"
          type="radio"
          valid={true}
        />
      )

      const input = screen.getByRole('switch', { name: 'Some label' })
      expect(input).toHaveAttribute('id', '2')
      expect(input).toHaveAttribute('type', 'checkbox')
      expect(input).toHaveClass('is-invalid', 'is-valid')

      // The check-input span and outer label wrapper are plain elements with no distinct
      // role of their own - the switch input is the only accessible entry point to reach them.
      // eslint-disable-next-line testing-library/no-node-access
      const checkInput = input.parentElement
      expect(checkInput).toHaveClass('check-input', 'secondary', 'is-invalid', 'is-valid')

      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = input.closest('label')
      expect(wrapper).toHaveClass(
        'form-check',
        'form-switch',
        'lg',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      expect(wrapper).toHaveTextContent('Some label')
    })
  })

  // A browser ignores `readonly` on a checkbox or a radio, and react-aria never saw it.
  describe('readOnly', () => {
    test('keeps the switch as it is and says it is read-only', () => {
      const onChange = vi.fn()
      render(<Switch label="Wi-Fi" onChange={onChange} readOnly />)
      const control = screen.getByRole('switch', { name: 'Wi-Fi' })
      expect(control).toHaveAttribute('aria-readonly', 'true')
      fireEvent.click(control)
      expect(control).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })

    test('the radio-backed switch too', () => {
      const onChange = vi.fn()
      render(
        <Switch label="Dark" name="theme" onChange={onChange} readOnly type="radio" value="dark" />
      )
      const control = screen.getByRole('switch', { name: 'Dark' })
      expect(control).toHaveAttribute('aria-readonly', 'true')
      fireEvent.click(control)
      expect(control).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('selection behavior', () => {
    test('an uncontrolled switch toggles on click and fires onChange(isSelected)', () => {
      const onChange = vi.fn()
      render(<Switch aria-label="Notifications" defaultSelected={false} onChange={onChange} />)
      const input = screen.getByRole('switch')
      expect(input).not.toBeChecked()
      fireEvent.click(input)
      expect(input).toBeChecked()
      expect(onChange).toHaveBeenCalledWith(true)
    })

    test('a controlled switch reflects isSelected and fires onChange(isSelected) without changing itself', () => {
      const onChange = vi.fn()
      render(<Switch aria-label="Notifications" isSelected={false} onChange={onChange} />)
      const input = screen.getByRole('switch')
      fireEvent.click(input)
      expect(onChange).toHaveBeenCalledWith(true)
      expect(input).not.toBeChecked()
    })

    // The radio-backed switch passed no handler without `onChange`, and React warned of a
    // `checked` input with none.
    test('a selected radio-backed switch with no onChange logs no warning', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      render(<Switch aria-label="Notifications" isSelected type="radio" />)
      expect(screen.getByRole('switch')).toBeChecked()
      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  // `role="switch"` on `<input type="radio">` failed axe's `aria-allowed-role`. The radio-type
  // switch is a checkbox that does what a radio group does.
  describe('type="radio"', () => {
    const Theme = (props: Partial<React.ComponentProps<typeof Switch>>) => (
      <form aria-label="Theme">
        <Switch label="Light" name="theme" type="radio" value="light" {...props} />
        <Switch label="Dark" name="theme" type="radio" value="dark" />
        <Switch label="Other" name="other" type="radio" value="other" />
      </form>
    )
    const control = (name: string) => screen.getByRole('switch', { name })
    const form = () => screen.getByRole('form', { name: 'Theme' }) as HTMLFormElement

    test('renders a checkbox switch with no axe violation', async () => {
      const { container } = render(<Theme defaultSelected required />)
      expect(control('Light')).toHaveAttribute('type', 'checkbox')
      expect(await axe(container)).toHaveNoViolations()
    })

    test('turning one on turns the others of its name off, and submits one value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Theme defaultSelected onChange={onChange} />)
      await user.click(control('Other'))
      expect(control('Light')).toBeChecked()
      await user.click(control('Dark'))
      expect(control('Dark')).toBeChecked()
      expect(control('Light')).not.toBeChecked()
      expect(control('Other')).toBeChecked()
      expect(new FormData(form()).getAll('theme')).toEqual(['dark'])
      expect(onChange).not.toHaveBeenCalled()
    })

    test('a click leaves the switch that is on, as a radio does', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Theme defaultSelected onChange={onChange} />)
      await user.click(control('Light'))
      expect(control('Light')).toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })

    test('a controlled one reports the switch turned on', async () => {
      const user = userEvent.setup()
      const ThemePicker = () => {
        const [theme, setTheme] = React.useState('light')
        return (
          <>
            {['light', 'dark'].map((value) => (
              <Switch
                key={value}
                isSelected={theme === value}
                label={value}
                name="theme"
                onChange={() => setTheme(value)}
                type="radio"
                value={value}
              />
            ))}
          </>
        )
      }
      render(<ThemePicker />)
      await user.click(control('dark'))
      expect(control('dark')).toBeChecked()
      expect(control('light')).not.toBeChecked()
    })

    test('required asks for one switch of the group, and a reset asks again', async () => {
      const user = userEvent.setup()
      render(<Theme required />)
      expect(form().checkValidity()).toBe(false)
      expect(control('Light')).toHaveAttribute('aria-required', 'true')
      await user.click(control('Dark'))
      expect(form().checkValidity()).toBe(true)
      vi.useFakeTimers()
      form().reset()
      vi.runAllTimers()
      vi.useRealTimers()
      expect(control('Dark')).not.toBeChecked()
      expect(form().checkValidity()).toBe(false)
    })
  })

  describe('validation state', () => {
    test('sets aria-invalid on the checkbox-backed switch when invalid', () => {
      render(<Switch aria-label="Notifications" invalid />)
      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
    })

    test('does not set aria-invalid when not invalid', () => {
      render(<Switch aria-label="Notifications" />)
      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid')
    })

    test('sets aria-invalid on the radio-backed switch when invalid', () => {
      render(<Switch aria-label="Notifications" type="radio" invalid />)
      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Switch ref={ref} aria-label="Notifications" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Switch label="Notifications" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
