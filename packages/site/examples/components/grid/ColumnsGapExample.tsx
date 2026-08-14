import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid columns={4} gap="1rem">
        <GridItem span={2}>span=2</GridItem>
        <GridItem span={2}>span=2</GridItem>
      </Grid>
      <Grid gap=".25rem 1rem">
        <GridItem span={6}>span=6</GridItem>
        <GridItem span={6}>span=6</GridItem>
        <GridItem span={6}>span=6</GridItem>
        <GridItem span={6}>span=6</GridItem>
      </Grid>
      <Grid gap="large">
        <GridItem span={4}>span=4</GridItem>
        <GridItem span={4}>span=4</GridItem>
        <GridItem span={4}>span=4</GridItem>
      </Grid>
    </>
  )
}
