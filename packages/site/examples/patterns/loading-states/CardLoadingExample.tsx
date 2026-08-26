import { useEffect, useState } from 'react'
import { Button, Card, CardImage, Skeleton, SkeletonLoader } from '@chassis-ui/react'

const FETCH_DELAY = 1500

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
        {loading ? 'Loading product…' : 'Product loaded'}
      </span>
      <Card
        className={loading ? 'skeleton-glow' : undefined}
        aria-hidden={loading || undefined}
        // `image` accepts a `src` string (auto-wrapped in `CardImage`) or a full element — here,
        // a `Skeleton`-shaped `CardImage` while loading, since `CardImage` always needs a real
        // `src` and can't be swapped through `Skeleton`'s own `component` the way text can.
        image={
          loading ? (
            <CardImage component={Skeleton} orientation="top" style={{ aspectRatio: '2 / 1' }} />
          ) : (
            'https://placehold.co/800x400'
          )
        }
        imageAlt=""
        title={
          <SkeletonLoader loading={loading} spans={6}>
            Denim Jacket
          </SkeletonLoader>
        }
        subtitle={
          <SkeletonLoader loading={loading} spans={4}>
            $89.00
          </SkeletonLoader>
        }
        text={
          <SkeletonLoader loading={loading} spans={[12, 9, 5]}>
            Classic fit, stonewashed denim, available in three colors.
          </SkeletonLoader>
        }
      />
      <Button onClick={() => setLoading(true)} disabled={loading}>
        Reload
      </Button>
    </div>
  )
}
