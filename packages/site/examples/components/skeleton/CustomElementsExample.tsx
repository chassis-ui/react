import { Avatar, Button, Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex align-items-center gap-md">
      <Skeleton component={Avatar} size="lg" aria-label="Loading" />
      <Skeleton component={Button} span={3} disabled aria-label="Loading" />
      <Skeleton component={Button} variant="outline" span={3} disabled aria-label="Loading" />
    </div>
  )
}
