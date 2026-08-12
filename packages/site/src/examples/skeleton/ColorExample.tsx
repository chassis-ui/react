import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Skeleton span={12} />
      <Skeleton color="default" span={12} />
      <Skeleton color="alternate" span={12} />
      <Skeleton color="primary" span={12} />
      <Skeleton color="secondary" span={12} />
      <Skeleton color="neutral" span={12} />
      <Skeleton color="success" span={12} />
      <Skeleton color="danger" span={12} />
      <Skeleton color="warning" span={12} />
      <Skeleton color="info" span={12} />
    </>
  )
}
