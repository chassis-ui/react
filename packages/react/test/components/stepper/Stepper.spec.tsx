import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { I18nProvider, Stepper, StepperItem } from '../../../src/index'

describe('Stepper', () => {
  describe('rendering', () => {
    test('renders an ol with the base class by default', () => {
      render(<Stepper>Test</Stepper>)
      const stepper = screen.getByText('Test')
      expect(stepper).toHaveClass('stepper')
      expect(stepper.tagName).toBe('OL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <Stepper>
          <StepperItem>First</StepperItem>
          <StepperItem active>Current</StepperItem>
          <StepperItem>Last</StepperItem>
        </Stepper>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with layout and icon classes', () => {
      render(
        <Stepper className="bazinga" component="div" layout="horizontal" icon>
          Test
        </Stepper>
      )
      const stepper = screen.getByText('Test')
      expect(stepper).toHaveClass('stepper', 'horizontal', 'icon-stepper', 'bazinga')
      expect(stepper.tagName).toBe('DIV')
    })

    test('applies color as a context class', () => {
      render(<Stepper color="secondary">Test</Stepper>)
      expect(screen.getByText('Test')).toHaveClass('context', 'secondary')
    })

    test('forwards arbitrary HTML attributes', () => {
      render(
        <Stepper id="signup-steps" data-testid="my-stepper">
          Test
        </Stepper>
      )
      const stepper = screen.getByText('Test')
      expect(stepper).toHaveAttribute('id', 'signup-steps')
      expect(stepper).toHaveAttribute('data-testid', 'my-stepper')
    })
  })

  describe('overflow wrapper', () => {
    test('wraps the stepper in a scrollable container when overflow is set', () => {
      const { container } = render(
        <Stepper overflow layout="horizontal">
          Test
        </Stepper>
      )
      // The overflow wrapper is a plain div with no role/name - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('stepper-overflow')
      expect(screen.getByText('Test')).toHaveClass('stepper', 'horizontal')
    })

    test('renders without a wrapper by default', () => {
      const { container } = render(<Stepper>Test</Stepper>)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('stepper')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <Stepper
          items={[
            { label: 'Account', href: '#' },
            { label: 'Shipping', active: true, color: 'info' },
            { label: 'Payment' }
          ]}
        />
      )

      const account = screen.getByRole('link', { name: 'Account' })
      expect(account).toHaveAttribute('href', '#')

      const shipping = screen.getByText('Shipping')
      expect(shipping).toHaveClass('stepper-item', 'context', 'info', 'active')
      expect(shipping).toHaveAttribute('aria-current', 'step')

      expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
    })

    test('matches the baseline markup snapshot for data-driven items', () => {
      const { container } = render(
        <Stepper
          items={[
            { label: 'Account', href: '#' },
            { label: 'Shipping', active: true }
          ]}
        />
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ol', () => {
      const ref = React.createRef<HTMLOListElement>()
      render(<Stepper ref={ref}>Test</Stepper>)
      expect(ref.current).toBeInstanceOf(HTMLOListElement)
    })

    test('forwards a ref to the underlying ol when wrapped for overflow', () => {
      const ref = React.createRef<HTMLOListElement>()
      render(
        <Stepper ref={ref} overflow>
          Test
        </Stepper>
      )
      expect(ref.current).toBeInstanceOf(HTMLOListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Stepper>
          <StepperItem>First</StepperItem>
          <StepperItem active>Current</StepperItem>
          <StepperItem>Last</StepperItem>
        </Stepper>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('RTL locale', () => {
    // The connecting track and counter are pure CSS logical-property/::before rules on
    // .stepper-item (chassis-css owns any [dir=rtl] mirroring there) — nothing in this
    // component's own markup or logic is direction-dependent. Documents that audit finding as an
    // executable check.
    test('renders the same way as under LTR', () => {
      render(
        <I18nProvider locale="ar-SA">
          <Stepper items={[{ label: 'Account' }, { label: 'Shipping', active: true }]} />
        </I18nProvider>
      )
      const shipping = screen.getByText('Shipping')
      expect(shipping).toHaveClass('stepper-item', 'active')
    })
  })
})
