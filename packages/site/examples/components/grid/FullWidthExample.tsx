import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span="full">span=full</GridItem>
      <GridItem span={{ base: 'full', md: 6 }}>span=full md:span=6</GridItem>
      <GridItem span={{ base: 'full', md: 6 }}>span=full md:span=6</GridItem>
    </Grid>
  )
}
