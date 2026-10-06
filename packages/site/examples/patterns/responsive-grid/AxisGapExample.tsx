import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid className="column-gap-xl row-gap-2xs">
      <GridItem span={6}>column-gap-xl row-gap-2xs</GridItem>
      <GridItem span={6}>column-gap-xl row-gap-2xs</GridItem>
      <GridItem span={6}>column-gap-xl row-gap-2xs</GridItem>
      <GridItem span={6}>column-gap-xl row-gap-2xs</GridItem>
    </Grid>
  )
}
