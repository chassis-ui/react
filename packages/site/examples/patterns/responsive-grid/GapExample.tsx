import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap={{ base: 'sm', lg: 'xl' }}>
      <GridItem span={6}>gap=sm lg:gap=xl</GridItem>
      <GridItem span={6}>gap=sm lg:gap=xl</GridItem>
      <GridItem span={6}>gap=sm lg:gap=xl</GridItem>
      <GridItem span={6}>gap=sm lg:gap=xl</GridItem>
    </Grid>
  )
}
