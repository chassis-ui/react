import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="contains-inline">
      <Stepper layout="small:horizontal">
        <StepperItem>Account</StepperItem>
        <StepperItem>Shipping</StepperItem>
        <StepperItem active>Payment</StepperItem>
        <StepperItem>Review</StepperItem>
      </Stepper>
    </div>
  )
}
