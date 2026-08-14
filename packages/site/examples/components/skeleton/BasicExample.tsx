import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="vstack gap-medium" aria-hidden="true">
      <Skeleton span={12} />
      <p>
        <Skeleton span={7} />
        <Skeleton span={4} />
        <Skeleton span={4} />
        <Skeleton span={6} />
        <Skeleton span={8} />
      </p>
    </div>
  )
}
