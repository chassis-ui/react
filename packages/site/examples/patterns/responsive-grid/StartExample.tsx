import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid>
        <GridItem span={4}>span=4</GridItem>
        <GridItem span={4} start={9}>
          span=4 start=9
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span="full" responsive={{ md: { span: 6, start: 4 } }}>
          span=full md:span=6 md:start=4
        </GridItem>
      </Grid>
    </>
  )
}
