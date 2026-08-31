import { Card, CardBody, CardHeader, CardText, CardTitle } from '@chassis-ui/react'

const COLORS = ['primary', 'secondary', 'neutral', 'success', 'danger', 'warning', 'info'] as const

export const Example = () => {
  return (
    <>
      {COLORS.map((color) => (
        <Card color={color} className="mb-medium" style={{ maxWidth: '18rem' }} key={color}>
          <CardHeader>Header</CardHeader>
          <CardBody>
            <CardTitle>{color} card title</CardTitle>
            <CardText>
              Some quick example text to build on the card title and make up the bulk of the card's
              content.
            </CardText>
          </CardBody>
        </Card>
      ))}
    </>
  )
}
