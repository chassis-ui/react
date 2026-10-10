import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FloatingInput, Select, Textarea, TextInput } from '../../../src/index'

const LABEL_WARNING = 'If you do not provide a visible label'

describe('FloatingInput', () => {
  describe('rendering', () => {
    test('renders the floating label bare (no .form-field) when no help/feedback are set', () => {
      const { container } = render(
        <FloatingInput label="Email address" ids={{ input: 'floatingInput' }}>
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
      expect(screen.getByText('Email address').parentElement).toHaveClass('form-floating')
    })

    test('renders the base class and className merged on the floating element', () => {
      render(
        <FloatingInput className="bazinga" label="Email address" ids={{ input: 'floatingInput' }}>
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.getByText('Email address').parentElement).toHaveClass(
        'form-floating',
        'bazinga'
      )
    })

    test('renders a label associated with the control via htmlFor', () => {
      render(
        <FloatingInput label="Email address" ids={{ input: 'floatingInput' }}>
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute(
        'id',
        'floatingInput'
      )
      expect(screen.getByText('Email address')).toHaveClass('form-label')
    })

    test('wraps in .form-field when help is set', () => {
      render(
        <FloatingInput
          help="We'll never share it."
          ids={{ help: 'floatingInput-help', input: 'floatingInput' }}
          label="Email address"
        >
          <input
            aria-describedby="floatingInput-help"
            className="form-input"
            id="floatingInput"
            placeholder="name@example.com"
          />
        </FloatingInput>
      )
      const help = screen.getByText("We'll never share it.")
      expect(help).toHaveClass('form-help')
      const floating = screen.getByText('Email address').parentElement
      expect(floating).toHaveClass('form-floating')
      expect(floating?.parentElement).toHaveClass('form-field')

      const input = screen.getByRole('textbox', { name: 'Email address' })
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('wraps in .form-field when invalid feedback is shown', () => {
      const { rerender } = render(
        <FloatingInput
          invalidFeedback="Required"
          ids={{ input: 'floatingInput' }}
          label="Email address"
        >
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.queryByText('Required')).toBeNull()
      expect(screen.getByText('Email address').parentElement).toHaveClass('form-floating')

      rerender(
        <FloatingInput
          invalid
          invalidFeedback="Required"
          ids={{ input: 'floatingInput' }}
          label="Email address"
        >
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.getByText('Required')).toHaveClass('invalid-feedback')
      expect(screen.getByText('Email address').parentElement?.parentElement).toHaveClass(
        'form-field'
      )
    })

    test('wraps in .form-field when valid feedback is shown', () => {
      render(
        <FloatingInput
          valid
          validFeedback="Looks good"
          ids={{ input: 'floatingInput' }}
          label="Email address"
        >
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying .form-floating div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <FloatingInput ref={ref} label="Email address" ids={{ input: 'floatingInput' }}>
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveClass('form-floating')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <FloatingInput
          help="We'll never share it."
          ids={{ help: 'floatingInput-help', input: 'floatingInput' }}
          label="Email address"
        >
          <input
            aria-describedby="floatingInput-help"
            className="form-input"
            id="floatingInput"
            placeholder="name@example.com"
          />
        </FloatingInput>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('generated ids', () => {
    test('a TextInput takes the id the label points at and is labelled by the label', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address">
          <TextInput placeholder="name@example.com" />
        </FloatingInput>
      )
      const label = screen.getByText('Email address')
      const input = screen.getByRole('textbox', { name: 'Email address' })
      expect(input.id).not.toBe('')
      expect(label).toHaveAttribute('for', input.id)
      expect(input).toHaveAttribute('aria-labelledby', label.id)
      expect(input).not.toHaveAttribute('aria-describedby')
      // Neither react-aria's warning about a field with no label nor this component's own.
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('a Textarea is labelled by the label without a warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Comments">
          <Textarea placeholder="Leave a comment here" />
        </FloatingInput>
      )
      const label = screen.getByText('Comments')
      const textarea = screen.getByRole('textbox', { name: 'Comments' })
      expect(label).toHaveAttribute('for', textarea.id)
      expect(textarea).toHaveAttribute('aria-labelledby', label.id)
      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
      warnSpy.mockRestore()
    })

    test('a Select takes the id the label points at', () => {
      render(
        <FloatingInput label="Works with selects">
          <Select>
            <option value="1">One</option>
          </Select>
        </FloatingInput>
      )
      const select = screen.getByRole('combobox', { name: 'Works with selects' })
      expect(screen.getByText('Works with selects')).toHaveAttribute('for', select.id)
    })

    test('the help describes the control', () => {
      render(
        <FloatingInput help="We'll never share it." label="Email address">
          <TextInput placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAccessibleDescription(
        "We'll never share it."
      )
    })

    test('the feedback describes the control only while it shows', () => {
      const { rerender } = render(
        <FloatingInput invalidFeedback="Required" label="Email address">
          <TextInput placeholder="name@example.com" />
        </FloatingInput>
      )
      const input = screen.getByRole('textbox', { name: 'Email address' })
      expect(input).not.toHaveAttribute('aria-describedby')

      rerender(
        <FloatingInput invalid invalidFeedback="Required" label="Email address">
          <TextInput invalid placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(input).toHaveAccessibleDescription('Required')
    })

    test('two floating inputs get ids of their own', () => {
      render(
        <>
          <FloatingInput label="Email address">
            <TextInput placeholder="name@example.com" />
          </FloatingInput>
          <FloatingInput label="Name">
            <TextInput placeholder="Jane" />
          </FloatingInput>
        </>
      )
      const email = screen.getByRole('textbox', { name: 'Email address' })
      const name = screen.getByRole('textbox', { name: 'Name' })
      expect(email.id).not.toBe(name.id)
    })

    test('the ids of the consumer replace the generated ones', () => {
      render(
        <FloatingInput
          help="We'll never share it."
          ids={{ help: 'email-help', input: 'email', label: 'email-label' }}
          label="Email address"
        >
          <TextInput placeholder="name@example.com" />
        </FloatingInput>
      )
      const input = screen.getByRole('textbox', { name: 'Email address' })
      expect(input).toHaveAttribute('id', 'email')
      expect(input).toHaveAttribute('aria-labelledby', 'email-label')
      expect(input).toHaveAttribute('aria-describedby', 'email-help')
      expect(screen.getByText('Email address')).toHaveAttribute('id', 'email-label')
      expect(screen.getByText("We'll never share it.")).toHaveAttribute('id', 'email-help')
    })

    test('an id the consumer repeats on the control is written once', () => {
      render(
        <FloatingInput
          help="We'll never share it."
          ids={{ help: 'email-help', input: 'email', label: 'email-label' }}
          label="Email address"
        >
          <TextInput
            aria-describedby="email-help"
            aria-labelledby="email-label"
            id="email"
            placeholder="name@example.com"
          />
        </FloatingInput>
      )
      const input = screen.getByRole('textbox', { name: 'Email address' })
      expect(input).toHaveAttribute('aria-labelledby', 'email-label')
      expect(input).toHaveAttribute('aria-describedby', 'email-help')
    })

    test('a field with a label of its own outside a FloatingInput is unchanged', () => {
      render(<TextInput label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveAttribute('aria-labelledby', screen.getByText('Name').id)
    })
  })

  describe('dev warnings', () => {
    test('warns when the label points at no element', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address">
          <input className="form-input" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('no element has the id that the label points at')
      )
      warnSpy.mockRestore()
    })

    test('warns when a field component has an id of its own that `ids.input` does not name', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address">
          <TextInput id="email" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('no element has the id that the label points at')
      )
      // Still named, through the label's id.
      expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute('id', 'email')
      warnSpy.mockRestore()
    })

    test('does not warn when ids.input is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address" ids={{ input: 'floatingInput' }}>
          <input className="form-input" id="floatingInput" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('does not warn when ids.label is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address" ids={{ label: 'floatingInput-label' }}>
          <input
            className="form-input"
            aria-labelledby="floatingInput-label"
            placeholder="name@example.com"
          />
        </FloatingInput>
      )
      expect(warnSpy).not.toHaveBeenCalled()
      expect(screen.getByText('Email address')).not.toHaveAttribute('for')
      warnSpy.mockRestore()
    })
  })
})
