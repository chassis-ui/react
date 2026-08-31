import { Link } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex position-relative">
      <div>
        <h4 className="mt-0">Card title</h4>
        <p>Some placeholder content the stretched link expands to cover, edge to edge.</p>
        <Link href="#" stretched>
          Go somewhere
        </Link>
      </div>
    </div>
  )
}
