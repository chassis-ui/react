import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap="zero">
      <GridItem span={{ base: 'full', sm: 6, md: 8 }}>span=full sm:span=6 md:span=8</GridItem>
      <GridItem span={{ base: 6, md: 4 }}>span=6 md:span=4</GridItem>
    </Grid>
  )
}
