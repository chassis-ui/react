import { Card, CardBody, CardHeader } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card>
      <CardHeader>Quote</CardHeader>
      <CardBody>
        <blockquote className="blockquote mb-0">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
          </p>
          <footer className="blockquote-footer">
            Someone famous in <cite title="Source Title">Source Title</cite>
          </footer>
        </blockquote>
      </CardBody>
    </Card>
  )
}
