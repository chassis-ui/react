import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid>
        <GridItem span="full" responsive={{ md: { span: 8 } }}>
          span=full md:span=8
        </GridItem>
        <GridItem span={6} responsive={{ md: { span: 4 } }}>
          span=6 md:span=4
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span={6} responsive={{ md: { span: 4 } }}>
          span=6 md:span=4
        </GridItem>
        <GridItem span={6} responsive={{ md: { span: 4 } }}>
          span=6 md:span=4
        </GridItem>
        <GridItem span={6} responsive={{ md: { span: 4 } }}>
          span=6 md:span=4
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span={6}>span=6</GridItem>
        <GridItem span={6}>span=6</GridItem>
      </Grid>
    </>
  )
}
