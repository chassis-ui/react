import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span={8} subgrid>
        <GridItem span={4}>Subgrid span=4</GridItem>
        <GridItem span={4}>Subgrid span=4</GridItem>
      </GridItem>
      <GridItem span={4}>span=4</GridItem>
    </Grid>
  )
}
