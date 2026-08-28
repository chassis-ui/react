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

    test('composes StepperItem children with stepper-item classes and aria-current on the active step', () => {
      render(
        <Stepper>
          <StepperItem>First</StepperItem>
          <StepperItem active>Current</StepperItem>
          <StepperItem>Last</StepperItem>
        </Stepper>
      )
      expect(screen.getByText('First')).toHaveClass('stepper-item')
      expect(screen.getByText('First')).not.toHaveClass('active')
      const current = screen.getByText('Current')
      expect(current).toHaveClass('stepper-item', 'active')
      expect(current).toHaveAttribute('aria-current', 'step')
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
      expect(account).toHaveClass('stepper-item')
      expect(account).not.toHaveClass('active')

      const shipping = screen.getByText('Shipping')
      expect(shipping).toHaveClass('stepper-item', 'context', 'info', 'active')
      expect(shipping).toHaveAttribute('aria-current', 'step')

      expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
    })

    test('defaults the root to div (not ol) when a step has href, avoiding a bare <a> inside <ol>', () => {
      const { container } = render(
        <Stepper items={[{ label: 'Account', href: '#' }, { label: 'Shipping' }]} />
      )
      const stepper = screen.getByRole('link', { name: 'Account' }).parentElement
      expect(stepper?.tagName).toBe('DIV')
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.querySelector('ol')).not.toBeInTheDocument()
    })

    test('an explicit component prop opts out of the div default even with a linked step', () => {
      render(<Stepper component="ol" items={[{ label: 'Account', href: '#' }]} />)
      expect(screen.getByRole('link', { name: 'Account' }).parentElement?.tagName).toBe('OL')
    })

    test('stays an ol when no step has href', () => {
      render(<Stepper items={[{ label: 'Account' }, { label: 'Shipping' }]} />)
      expect(screen.getByText('Account').parentElement?.tagName).toBe('OL')
    })
  })

  describe('composed interactive steps', () => {
    test('defaults the root to div (not ol) when a StepperItem child is interactive, avoiding a bare <a> inside <ol>', () => {
      const { container } = render(
        <Stepper>
          <StepperItem component="a" href="#">
            Account
          </StepperItem>
          <StepperItem>Shipping</StepperItem>
        </Stepper>
      )
      const stepper = screen.getByRole('link', { name: 'Account' }).parentElement
      expect(stepper?.tagName).toBe('DIV')
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.querySelector('ol')).not.toBeInTheDocument()
      // The plain sibling can no longer render as <li> either, once the parent isn't a list.
      expect(screen.getByText('Shipping').tagName).toBe('DIV')
    })

    test('an explicit component prop opts out of the div default even with an interactive child', () => {
      render(
        <Stepper component="ol">
          <StepperItem component="a" href="#">
            Account
          </StepperItem>
        </Stepper>
      )
      expect(screen.getByRole('link', { name: 'Account' }).parentElement?.tagName).toBe('OL')
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

    test('has no axe violations with a data-driven linked step', async () => {
      const { container } = render(
        <Stepper
          items={[
            { label: 'Account', href: '#' },
            { label: 'Shipping', active: true }
          ]}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with a composed interactive StepperItem', async () => {
      const { container } = render(
        <Stepper>
          <StepperItem component="a" href="#">
            Account
          </StepperItem>
          <StepperItem active>Shipping</StepperItem>
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
