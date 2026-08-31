import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper layout="horizontal">
      <StepperItem>Account</StepperItem>
      <StepperItem>Shipping</StepperItem>
      <StepperItem active>Payment</StepperItem>
      <StepperItem>Review</StepperItem>
    </Stepper>
  )
}
