import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid rows={3} columns={3}>
      <GridItem>Auto-column</GridItem>
      <GridItem start={2} style={{ gridRow: 2 }}>
        Auto-column
      </GridItem>
      <GridItem start={3} style={{ gridRow: 3 }}>
        Auto-column
      </GridItem>
    </Grid>
  )
}
