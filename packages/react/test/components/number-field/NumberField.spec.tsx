import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'

import { IconProvider, InputAdorn, NumberField } from '../../../src/index'

// The `.form-input` wrapper has no role or text of its own: found by its class through a text
// matcher, which is handed every element.
const getByClass = (className: string) =>
  screen.getByText((_, element) => element?.classList.contains(className) ?? false)
const queryByClass = (className: string) =>
  screen.queryByText((_, element) => element?.classList.contains(className) ?? false)

describe('NumberField', () => {
  describe('rendering', () => {
    test('renders a labelled text input inside .form-input.number-field, with two step buttons', () => {
      render(<NumberField defaultValue={3} label="Quantity" />)
      const input = screen.getByRole('textbox', { name: 'Quantity' })
      expect(input).toHaveClass('ghost-input')
      expect(input).toHaveValue('3')
      expect(input).toHaveAttribute('inputmode', 'numeric')
      expect(input).toHaveAttribute('aria-roledescription', 'Number field')

      const wrapper = getByClass('number-field')
      expect(wrapper).toHaveClass('form-input')
      expect(wrapper).toContainElement(input)

      const buttons = getByClass('number-field-buttons')
      expect(wrapper).toContainElement(buttons)
      const increase = screen.getByRole('button', { name: 'Increase Quantity' })
      const decrease = screen.getByRole('button', { name: 'Decrease Quantity' })
      expect(increase).toHaveClass('number-field-increment')
      expect(decrease).toHaveClass('number-field-decrement')
      expect(buttons).toContainElement(increase)
      expect(buttons).toContainElement(decrease)
    })

    test('keeps the step buttons out of the tab order, controlling the input', () => {
      render(<NumberField aria-label="Amount" />)
      const input = screen.getByRole('textbox', { name: 'Amount' })
      for (const name of ['Increase Amount', 'Decrease Amount']) {
        const button = screen.getByRole('button', { name })
        expect(button).toHaveAttribute('tabindex', '-1')
        expect(button).toHaveAttribute('aria-controls', input.id)
      }
    })

    test('moves size and the caller className to the wrapper, validation to the input', () => {
      render(<NumberField aria-label="Amount" className="custom" invalid size="lg" />)
      const input = screen.getByRole('textbox', { name: 'Amount' })
      expect(input).toHaveClass('ghost-input', 'is-invalid')
      expect(input).not.toHaveClass('lg', 'custom')
      const wrapper = getByClass('number-field')
      expect(wrapper).toHaveClass('form-input', 'lg', 'custom')
      expect(wrapper).not.toHaveClass('is-invalid')
    })

    test('renders a bare .form-input without step buttons or adorns', () => {
      render(
        <NumberField aria-label="Year" className="custom" size="sm" stepButtons={false} valid />
      )
      const input = screen.getByRole('textbox', { name: 'Year' })
      expect(input).toHaveClass('form-input', 'sm', 'custom', 'is-valid')
      expect(queryByClass('number-field')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('renders adorns around the input, before the step buttons', () => {
      render(
        <NumberField
          adornEnd={<InputAdorn>cm</InputAdorn>}
          adornStart={<InputAdorn>≈</InputAdorn>}
          aria-label="Height"
        />
      )
      const wrapper = getByClass('number-field')
      expect(wrapper).toHaveTextContent('≈cm')
      expect(wrapper).toContainElement(screen.getByText('cm'))
      expect(
        screen.getByText('cm').compareDocumentPosition(getByClass('number-field-buttons'))
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    test('keeps a wrapper for adorns without step buttons', () => {
      render(
        <NumberField
          adornEnd={<InputAdorn>cm</InputAdorn>}
          aria-label="Height"
          stepButtons={false}
        />
      )
      expect(getByClass('number-field')).toContainElement(
        screen.getByRole('textbox', { name: 'Height' })
      )
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('puts style on the outermost element', () => {
      render(
        <>
          <NumberField aria-label="Wrapped" style={{ maxWidth: '10rem' }} />
          <NumberField aria-label="Bare" stepButtons={false} style={{ maxWidth: '12rem' }} />
        </>
      )
      expect(getByClass('number-field')).toHaveAttribute('style', 'max-width: 10rem;')
      expect(screen.getByRole('textbox', { name: 'Wrapped' })).not.toHaveAttribute('style')
      expect(screen.getByRole('textbox', { name: 'Bare' })).toHaveAttribute(
        'style',
        'max-width: 12rem;'
      )
    })

    test('formats the value with formatOptions', () => {
      render(
        <NumberField
          aria-label="Price"
          defaultValue={1250.5}
          formatOptions={{ currency: 'EUR', style: 'currency' }}
        />
      )
      expect(screen.getByRole('textbox', { name: 'Price' })).toHaveValue('€1,250.50')
    })
  })

  describe('value', () => {
    test('steps with the buttons, keeping focus on the input', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<NumberField defaultValue={1} label="Quantity" onChange={onChange} />)
      const input = screen.getByRole('textbox', { name: 'Quantity' })

      await user.click(screen.getByRole('button', { name: 'Increase Quantity' }))
      expect(input).toHaveValue('2')
      expect(onChange).toHaveBeenLastCalledWith(2)
      expect(input).toHaveFocus()

      await user.click(screen.getByRole('button', { name: 'Decrease Quantity' }))
      await user.click(screen.getByRole('button', { name: 'Decrease Quantity' }))
      expect(input).toHaveValue('0')
      expect(onChange).toHaveBeenLastCalledWith(0)
    })

    test('steps with the arrow keys', async () => {
      const user = userEvent.setup()
      render(<NumberField aria-label="Amount" defaultValue={5} step={5} />)
      const input = screen.getByRole('textbox', { name: 'Amount' })
      await user.click(input)
      await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}')
      expect(input).toHaveValue('10')
    })

    test('goes to min and max with Home and End', async () => {
      const user = userEvent.setup()
      render(<NumberField aria-label="Seats" defaultValue={4} max={10} min={2} />)
      const input = screen.getByRole('textbox', { name: 'Seats' })
      await user.click(input)
      await user.keyboard('{End}')
      expect(input).toHaveValue('10')
      await user.keyboard('{Home}')
      expect(input).toHaveValue('2')
    })

    test.each([
      ['with step buttons', true],
      ['without a wrapper', false]
    ])('steps with the mouse wheel while focused, %s', async (_, stepButtons) => {
      const user = userEvent.setup()
      render(<NumberField aria-label="Amount" defaultValue={5} stepButtons={stepButtons} />)
      const input = screen.getByRole('textbox', { name: 'Amount' })
      fireEvent.wheel(input, { deltaY: 10 })
      expect(input).toHaveValue('5')
      await user.click(input)
      fireEvent.wheel(input, { deltaY: 10 })
      expect(input).toHaveValue('6')
      fireEvent.wheel(input, { deltaY: -10 })
      expect(input).toHaveValue('5')
    })

    test('disables a step button at min and max, and clamps a typed value on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <NumberField aria-label="Seats" defaultValue={10} max={10} min={0} onChange={onChange} />
      )
      expect(screen.getByRole('button', { name: 'Increase Seats' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Decrease Seats' })).toBeEnabled()

      const input = screen.getByRole('textbox', { name: 'Seats' })
      await user.clear(input)
      await user.type(input, '42')
      await user.tab()
      expect(input).toHaveValue('10')
      expect(onChange).not.toHaveBeenCalledWith(42)
    })

    test('snaps a typed value to the step, counted from min', async () => {
      const user = userEvent.setup()
      render(<NumberField aria-label="Seats" min={1} step={3} />)
      const input = screen.getByRole('textbox', { name: 'Seats' })
      await user.type(input, '6')
      await user.tab()
      expect(input).toHaveValue('7')
    })

    test('reports an emptied field as NaN', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<NumberField aria-label="Amount" defaultValue={4} onChange={onChange} />)
      await user.clear(screen.getByRole('textbox', { name: 'Amount' }))
      await user.tab()
      expect(onChange).toHaveBeenLastCalledWith(NaN)
    })

    test('shows a controlled value, and reports steps without changing it', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(<NumberField aria-label="Amount" onChange={onChange} value={7} />)
      const input = screen.getByRole('textbox', { name: 'Amount' })

      await user.click(screen.getByRole('button', { name: 'Increase Amount' }))
      expect(onChange).toHaveBeenLastCalledWith(8)
      expect(input).toHaveValue('7')

      rerender(<NumberField aria-label="Amount" onChange={onChange} value={8} />)
      expect(input).toHaveValue('8')
    })
  })

  describe('states', () => {
    test('disables the input and both buttons', () => {
      render(<NumberField aria-label="Amount" defaultValue={1} disabled />)
      expect(screen.getByRole('textbox', { name: 'Amount' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Increase Amount' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Decrease Amount' })).toBeDisabled()
    })

    test('keeps a read-only value from stepping, by button or key', async () => {
      const user = userEvent.setup()
      render(<NumberField aria-label="Amount" defaultValue={1} max={9} readOnly />)
      const input = screen.getByRole('textbox', { name: 'Amount' })
      expect(input).toHaveAttribute('readonly')
      expect(screen.getByRole('button', { name: 'Increase Amount' })).toBeDisabled()
      await user.click(input)
      await user.keyboard('{ArrowUp}{End}')
      expect(input).toHaveValue('1')
    })

    test('marks a required field', () => {
      render(<NumberField aria-label="Amount" required />)
      expect(screen.getByRole('textbox', { name: 'Amount' })).toBeRequired()
    })

    test('describes the input with its help and feedback only', () => {
      render(
        <NumberField help="Whole units." invalid invalidFeedback="Too many." label="Quantity" />
      )
      const input = screen.getByRole('textbox', { name: 'Quantity' })
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAccessibleDescription('Whole units. Too many.')
      const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []
      expect(ids).toHaveLength(2)
    })
  })

  describe('form', () => {
    test('submits the number, not the formatted text, under name', () => {
      render(
        <form aria-label="Order">
          <NumberField
            aria-label="Price"
            defaultValue={1250.5}
            formatOptions={{ currency: 'EUR', style: 'currency' }}
            name="price"
          />
        </form>
      )
      expect(screen.getByRole('form', { name: 'Order' })).toHaveFormValues({ price: '1250.5' })
      expect(screen.getByRole('textbox', { name: 'Price' })).not.toHaveAttribute('name')
    })

    test('submits an empty field as an empty value', () => {
      render(
        <form aria-label="Order">
          <NumberField aria-label="Price" name="price" />
        </form>
      )
      expect(screen.getByRole('form', { name: 'Order' })).toHaveFormValues({ price: '' })
    })

    test('resets with a form it is linked to by id', async () => {
      const user = userEvent.setup()
      render(
        <>
          <form aria-label="Order" id="order">
            <button type="reset">Reset</button>
          </form>
          <NumberField aria-label="Seats" defaultValue={3} form="order" name="seats" />
        </>
      )
      const input = screen.getByRole('textbox', { name: 'Seats' })
      await user.clear(input)
      await user.type(input, '7')
      await user.tab()
      expect(input).toHaveValue('7')

      // jsdom leaves an element linked by `form` out of `form.elements`, so the submitted value
      // isn't asserted here; the reset reaching the field is.
      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(input).toHaveValue('3')
    })

    test('submits nothing while disabled, and nothing without a name', () => {
      render(
        <form aria-label="Order">
          <NumberField aria-label="Price" defaultValue={2} disabled name="price" />
          <NumberField aria-label="Other" defaultValue={3} />
        </form>
      )
      expect(screen.getByRole('form', { name: 'Order' })).toHaveFormValues({})
    })
  })

  describe('icons and names', () => {
    test("takes the buttons' names and icons from props", () => {
      render(
        <NumberField
          aria-label="Amount"
          decrementAriaLabel="Less"
          decrementIcon={<svg data-testid="less-icon" />}
          incrementAriaLabel="More"
          incrementIcon={<svg data-testid="more-icon" />}
        />
      )
      expect(screen.getByRole('button', { name: 'More' })).toContainElement(
        screen.getByTestId('more-icon')
      )
      expect(screen.getByRole('button', { name: 'Less' })).toContainElement(
        screen.getByTestId('less-icon')
      )
    })

    test("takes the buttons' icons from IconProvider", () => {
      render(
        <IconProvider
          icons={{
            decrement: <svg data-testid="provider-less" />,
            increment: <svg data-testid="provider-more" />
          }}
        >
          <NumberField aria-label="Amount" />
        </IconProvider>
      )
      expect(screen.getByRole('button', { name: 'Increase Amount' })).toContainElement(
        screen.getByTestId('provider-more')
      )
      expect(screen.getByRole('button', { name: 'Decrease Amount' })).toContainElement(
        screen.getByTestId('provider-less')
      )
    })
  })

  describe('hydration', () => {
    // react-aria picks the keyboard and the role description by platform, which the server
    // doesn't know: its HTML is what a desktop gets, and an iPhone's differs.
    test('hydrates on an iPhone without a mismatch, then takes its keyboard', async () => {
      const element = <NumberField defaultValue={2} label="Quantity" />
      const host = document.createElement('div')
      host.innerHTML = renderToString(element)
      document.body.append(host)
      const input = screen.getByRole('textbox', { name: 'Quantity' })
      expect(input).toHaveAttribute('inputmode', 'numeric')
      expect(input).not.toHaveAttribute('aria-roledescription')

      const platform = vi.spyOn(navigator, 'platform', 'get').mockReturnValue('iPhone')
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onRecoverableError = vi.fn()
      let root: ReturnType<typeof hydrateRoot> | undefined
      await act(async () => {
        root = hydrateRoot(host, element, { onRecoverableError })
      })

      expect(consoleError).not.toHaveBeenCalled()
      expect(onRecoverableError).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox', { name: 'Quantity' })).toBe(input)
      // An iPhone's numeric keyboard has no minus sign, and this field takes negative numbers.
      expect(input).toHaveAttribute('inputmode', 'text')
      expect(input).not.toHaveAttribute('aria-roledescription')

      act(() => root?.unmount())
      host.remove()
      consoleError.mockRestore()
      platform.mockRestore()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<NumberField aria-label="Amount" ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Amount' }))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a label, help, feedback and a value at max', async () => {
      const { container } = render(
        <form aria-label="Order">
          <NumberField
            defaultValue={10}
            help="Up to 10."
            label="Quantity"
            max={10}
            min={1}
            name="quantity"
            valid
            validFeedback="In stock."
          />
        </form>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
