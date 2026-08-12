import { useEffect, useState } from 'react'
import { Progress } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((current) =>
        Math.min(100, current >= 100 ? 10 : current + Math.round(Math.random() * 25))
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <Progress label="Progress" showValue inlineValue value={value} />
}
