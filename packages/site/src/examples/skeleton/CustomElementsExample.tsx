import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex gap-medium">
      <Skeleton
        component="button"
        className="button disabled"
        span={3}
        aria-disabled="true"
        aria-label="Loading"
      />
      <Skeleton
        component="button"
        className="button primary disabled"
        span={3}
        aria-disabled="true"
        aria-label="Loading"
      />
    </div>
  )
}
