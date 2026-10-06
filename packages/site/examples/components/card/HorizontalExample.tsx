import { Card, CardBody, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card responsive={{ lg: 'row' }}>
      <div className="lg:w-4/12">
        <CardImage
          orientation="top"
          responsive={{ lg: 'start' }}
          src="https://placehold.co/800x400"
          alt=""
          style={{ height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="lg:w-8/12">
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <small className="fg-subtle">Last updated 3 mins ago</small>
          </CardText>
        </CardBody>
      </div>
    </Card>
  )
}
