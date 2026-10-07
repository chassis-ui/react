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
        <GridItem span={{ base: 'full', md: 6 }} start={{ md: 4 }}>
          span=full md:span=6 md:start=4
        </GridItem>
      </Grid>
    </>
  )
}
