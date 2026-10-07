import { Grid, GridItem } from '@chassis-ui/react'

const Items = () => (
  <Grid contained>
    <GridItem span="full" responsive={{ '@sm': { span: 4 } }}>
      Item
    </GridItem>
    <GridItem span="full" responsive={{ '@sm': { span: 4 } }}>
      Item
    </GridItem>
    <GridItem span="full" responsive={{ '@sm': { span: 4 } }}>
      Item
    </GridItem>
  </Grid>
)

export const Example = () => {
  return (
    <>
      <div className="contains-inline mb-md" style={{ width: '18rem' }}>
        <Items />
      </div>
      <div className="contains-inline" style={{ width: '40rem' }}>
        <Items />
      </div>
    </>
  )
}
