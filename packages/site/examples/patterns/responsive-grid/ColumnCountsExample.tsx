import { Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={2} gap="sm" responsive={{ md: { columns: 3 }, lg: { columns: 5, gap: 'md' } }}>
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
