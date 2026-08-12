import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Skeleton component="p" animation="glow">
        <Skeleton span={12} />
      </Skeleton>
      <Skeleton component="p" animation="wave">
        <Skeleton span={12} />
      </Skeleton>
    </>
  )
}
