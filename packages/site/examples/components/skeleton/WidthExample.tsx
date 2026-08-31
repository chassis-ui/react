import { Skeleton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Skeleton span={6} />
      <Skeleton className="w-75" />
      <Skeleton style={{ width: '30%' }} />
    </>
  )
}
