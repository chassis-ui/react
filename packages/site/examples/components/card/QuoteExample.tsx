import { Card, CardBody, CardHeader } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card>
      <CardHeader>Quote</CardHeader>
      <CardBody>
        <figure className="mb-0">
          <blockquote className="blockquote">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
            </p>
          </blockquote>
          <figcaption className="attribution mb-0">
            Someone famous in <cite title="Source Title">Source Title</cite>
          </figcaption>
        </figure>
      </CardBody>
    </Card>
  )
}
