import { Card, CardBody, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card>
      <CardBody direction={{ lg: 'row' }} gap="md">
        <div className="lg:w-4/12">
          <CardImage src="https://placehold.co/800x400" alt="" />
        </div>
        <div className="lg:w-8/12">
          <CardBody className="p-0">
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
            <CardText className="mb-0">
              <small className="fg-subtle">Last updated 3 mins ago</small>
            </CardText>
          </CardBody>
        </div>
      </CardBody>
    </Card>
  )
}
