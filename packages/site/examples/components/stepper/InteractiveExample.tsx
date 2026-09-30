import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <nav aria-label="Progress">
      <Stepper>
        <StepperItem href="#">Account</StepperItem>
        <StepperItem href="#" active>
          <span className="visually-hidden">Current step: </span>Shipping
        </StepperItem>
        <StepperItem href="#">Payment</StepperItem>
      </Stepper>
    </nav>
  )
}
