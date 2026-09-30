import { useHydrated } from '@chassis-ui/react'

export const Example = () => {
  const hydrated = useHydrated()
  return (
    <p>
      {hydrated
        ? `Your time zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
        : 'Finding your time zone…'}
    </p>
  )
}
