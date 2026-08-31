import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <nav aria-label="Progress">
      <Stepper>
        <StepperItem component="a" href="#">
          Account
        </StepperItem>
        <StepperItem component="a" href="#" active>
          <span className="visually-hidden">Current step: </span>Shipping
        </StepperItem>
        <StepperItem component="a" href="#">
          Payment
        </StepperItem>
      </Stepper>
    </nav>
  )
}
