import { Avatar, Button, Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex align-items-center gap-medium">
      <Skeleton component={Avatar} size="large" aria-label="Loading" />
      <Skeleton component={Button} span={3} disabled aria-label="Loading" />
      <Skeleton component={Button} variant="outline" span={3} disabled aria-label="Loading" />
    </div>
  )
}
