import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FloatingInput } from '../../../src/index'

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

  describe('dev warnings', () => {
    test('warns when neither ids.input nor ids.label are set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FloatingInput label="Email address">
          <input className="form-input" placeholder="name@example.com" />
        </FloatingInput>
      )
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`ids.input`/`ids.label`'))
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
      warnSpy.mockRestore()
    })
  })
})
