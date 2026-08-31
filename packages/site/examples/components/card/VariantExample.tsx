import { Card, CardBody, CardHeader, CardText, CardTitle } from '@chassis-ui/react'

const VARIANTS = ['solid', 'smooth', 'outline'] as const

export const Example = () => {
  return (
    <>
      {VARIANTS.map((variant) => (
        <Card
          color="primary"
          variant={variant}
          className="mb-medium"
          style={{ maxWidth: '18rem' }}
          key={variant}
        >
          <CardHeader>Header</CardHeader>
          <CardBody>
            <CardTitle>{variant} card title</CardTitle>
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
