import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper layout="horizontal" color="secondary">
      <StepperItem>Account</StepperItem>
      <StepperItem>Shipping</StepperItem>
      <StepperItem active>Payment</StepperItem>
      <StepperItem>Review</StepperItem>
    </Stepper>
  )
}
