import { Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid>
        <GridItem span="full" responsive={{ sm: { span: 8 } }}>
          span=full sm:span=8
        </GridItem>
        <GridItem span="full" responsive={{ sm: { span: 4 } }}>
          span=full sm:span=4
        </GridItem>
      </Grid>
      <Grid columns={1} responsive={{ sm: { columns: 3 } }}>
        <div>sm:columns=3</div>
        <div>sm:columns=3</div>
        <div>sm:columns=3</div>
      </Grid>
    </>
  )
}
