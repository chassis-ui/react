import { useEffect, useState } from 'react'
import { Avatar, Button, SkeletonLoader } from '@chassis-ui/react'

const FETCH_DELAY = 1500

const user = {
  name: 'Jordan Lee',
  avatar: 'https://i.pravatar.cc/80'
}

export const Example = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timeout = setTimeout(() => setLoading(false), FETCH_DELAY)
    return () => clearTimeout(timeout)
  }, [loading])

  return (
    <div className="vstack gap-medium" style={{ maxWidth: '20rem' }}>
      <span className="visually-hidden" aria-live="polite">
        {loading ? 'Loading profile…' : 'Profile loaded'}
      </span>
      <div
        className={`d-flex align-items-center gap-medium${loading ? ' skeleton-glow' : ''}`}
        aria-hidden={loading || undefined}
      >
        <SkeletonLoader loading={loading} component={Avatar} size="large">
          <Avatar src={user.avatar} alt={user.name} size="large" />
        </SkeletonLoader>
        {/* The growable wrapper stays in place across both states — a class passed straight to
            `SkeletonLoader` would vanish once `loading` is `false`, since it renders `children`
            with no wrapper of its own then. */}
        <div className="font-large flex-grow-1">
          <SkeletonLoader loading={loading} spans={6}>
            {user.name}
          </SkeletonLoader>
        </div>
        <SkeletonLoader loading={loading} component={Button} spans={3} disabled>
          <Button>Follow</Button>
        </SkeletonLoader>
      </div>
      <Button onClick={() => setLoading(true)} disabled={loading} className="align-self-start">
        Reload
      </Button>
    </div>
  )
}
