import { Container, Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Grid>
        <GridItem span={4}>One of three columns</GridItem>
        <GridItem span={4}>One of three columns</GridItem>
        <GridItem span={4}>One of three columns</GridItem>
      </Grid>
    </Container>
  )
}
