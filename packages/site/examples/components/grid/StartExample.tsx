import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span={4} start={3}>
        span=4 start=3
      </GridItem>
      <GridItem span={4}>span=4</GridItem>
    </Grid>
  )
}
