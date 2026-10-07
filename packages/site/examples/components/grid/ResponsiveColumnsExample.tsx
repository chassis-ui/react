import { Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 'sm', lg: 'md' }}>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
    </Grid>
  )
}
