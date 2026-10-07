import { Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={{ base: 2, md: 3, lg: 5 }} gap={{ base: 'sm', lg: 'md' }}>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
    </Grid>
  )
}
