import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span={3}>span=3</GridItem>
      <GridItem span={3} end={13}>
        span=3 end=13
      </GridItem>
    </Grid>
  )
}
