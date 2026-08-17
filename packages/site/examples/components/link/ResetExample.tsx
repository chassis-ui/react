import { Link } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <p className="fg-subtle">
        Secondary body text with a{' '}
        <Link href="#" reset>
          reset link
        </Link>
        .
      </p>
      <p className="fg-subtle">
        Secondary body text with a <Link href="#">normal link</Link>.
      </p>
    </>
  )
}
