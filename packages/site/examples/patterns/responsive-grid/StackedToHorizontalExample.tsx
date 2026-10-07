import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid>
        <GridItem span={{ base: 'full', sm: 8 }}>span=full sm:span=8</GridItem>
        <GridItem span={{ base: 'full', sm: 4 }}>span=full sm:span=4</GridItem>
      </Grid>
      <Grid columns={{ base: 1, sm: 3 }}>
        <div>sm:columns=3</div>
        <div>sm:columns=3</div>
        <div>sm:columns=3</div>
      </Grid>
    </>
  )
}
