import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap="md">
      <GridItem span={8}>
        <Grid columns={2} gap="sm">
          <div>Nested column</div>
          <div>Nested column</div>
        </Grid>
      </GridItem>
      <GridItem span={4}>span=4</GridItem>
    </Grid>
  )
}
