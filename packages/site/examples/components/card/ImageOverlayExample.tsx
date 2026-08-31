import { Card, CardImage, CardImageOverlay, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card className="mb-medium bg-dark text-white">
      <CardImage src="https://placehold.co/800x400" />
      <CardImageOverlay>
        <CardTitle>Card title</CardTitle>
        <CardText>
          This is a wider card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </CardText>
        <CardText>Last updated 3 mins ago</CardText>
      </CardImageOverlay>
    </Card>
  )
}
