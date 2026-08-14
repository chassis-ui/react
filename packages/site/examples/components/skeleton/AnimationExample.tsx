import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Skeleton component="p" animation="glow" className="w-100">
        <Skeleton span={12} />
      </Skeleton>
      <Skeleton component="p" animation="wave" className="w-100">
        <Skeleton span={12} />
      </Skeleton>
    </>
  )
}
