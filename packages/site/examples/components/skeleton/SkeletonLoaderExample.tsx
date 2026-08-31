import { useState } from 'react'
import { Button, SkeletonLoader } from '@chassis-ui/react'

export const Example = () => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="vstack gap-medium">
      <p className={loading ? 'skeleton-glow mb-0' : 'mb-0'}>
        <SkeletonLoader loading={loading} spans={[12, 9, 5]}>
          Chassis is a design system and component library built for teams who need to move fast
          without sacrificing consistency or accessibility.
        </SkeletonLoader>
      </p>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? 'Mark as loaded' : 'Reset to loading'}
      </Button>
    </div>
  )
}
