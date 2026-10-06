import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid>
        <GridItem span={3}>span=3</GridItem>
        <GridItem span={3}>span=3</GridItem>
        <GridItem span={3}>span=3</GridItem>
        <GridItem span={3}>span=3</GridItem>
      </Grid>
      <Grid>
        <GridItem span={8}>span=8</GridItem>
        <GridItem span={4}>span=4</GridItem>
      </Grid>
    </>
  )
}
