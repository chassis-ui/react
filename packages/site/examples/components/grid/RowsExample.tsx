import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid rows={2}>
      <GridItem span={4} rowSpan={2}>
        span=4 rowSpan=2
      </GridItem>
      <GridItem span={8}>span=8</GridItem>
      <GridItem span={8} start={5} rowStart={2}>
        span=8 start=5 rowStart=2
      </GridItem>
    </Grid>
  )
}
