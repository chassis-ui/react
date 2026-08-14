import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper layout="horizontal" icon>
      <StepperItem>Account</StepperItem>
      <StepperItem active>Shipping</StepperItem>
      <StepperItem>Payment</StepperItem>
      <StepperItem>Review</StepperItem>
    </Stepper>
  )
}
