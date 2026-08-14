import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper layout="horizontal">
      <StepperItem color="success">Order placed</StepperItem>
      <StepperItem color="success">Payment confirmed</StepperItem>
      <StepperItem active color="info">
        Preparing shipment
      </StepperItem>
      <StepperItem color="danger">Delivery delayed</StepperItem>
    </Stepper>
  )
}
