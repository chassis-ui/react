import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span={{ base: 6, md: 4 }}>span=6 md:span=4</GridItem>
      <GridItem span={{ base: 6, md: 4 }}>span=6 md:span=4</GridItem>
      <GridItem span={{ base: 6, md: 4 }}>span=6 md:span=4</GridItem>
    </Grid>
  )
}
