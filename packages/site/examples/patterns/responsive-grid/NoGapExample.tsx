import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap="zero">
      <GridItem span="full" responsive={{ sm: { span: 6 }, md: { span: 8 } }}>
        span=full sm:span=6 md:span=8
      </GridItem>
      <GridItem span={6} responsive={{ md: { span: 4 } }}>
        span=6 md:span=4
      </GridItem>
    </Grid>
  )
}
