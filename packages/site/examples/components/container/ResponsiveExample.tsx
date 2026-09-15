import { Container } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Container fluidUntil="sm">100% wide until sm breakpoint</Container>
      <Container fluidUntil="md">100% wide until md breakpoint</Container>
      <Container fluidUntil="lg">100% wide until lg breakpoint</Container>
      <Container fluidUntil="xl">100% wide until extra lg breakpoint</Container>
      <Container fluidUntil="2xl">100% wide until extra extra lg breakpoint</Container>
    </>
  )
}
