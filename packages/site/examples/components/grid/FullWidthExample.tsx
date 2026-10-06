import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid>
      <GridItem span="full">span=full</GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        span=full md:span=6
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        span=full md:span=6
      </GridItem>
    </Grid>
  )
}
