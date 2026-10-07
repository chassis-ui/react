import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={3} flow="dense" gap="md">
      <GridItem span={2}>1</GridItem>
      <GridItem span={2}>2</GridItem>
      <GridItem>3</GridItem>
      <GridItem>4</GridItem>
    </Grid>
  )
}
