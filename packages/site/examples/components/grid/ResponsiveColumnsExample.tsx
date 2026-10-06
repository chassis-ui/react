import { Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={1} gap="sm" responsive={{ sm: { columns: 2 }, lg: { columns: 4, gap: 'md' } }}>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
      <div>Column</div>
    </Grid>
  )
}
