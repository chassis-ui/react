import { Container } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Container fluidUntil="small">100% wide until small breakpoint</Container>
      <Container fluidUntil="medium">100% wide until medium breakpoint</Container>
      <Container fluidUntil="large">100% wide until large breakpoint</Container>
      <Container fluidUntil="xlarge">100% wide until extra large breakpoint</Container>
      <Container fluidUntil="2xlarge">100% wide until extra extra large breakpoint</Container>
    </>
  )
}
