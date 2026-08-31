import { Button, Card } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card
      style={{ width: '18rem' }}
      image="https://placehold.co/800x400"
      title="Card title"
      text="Some quick example text to build on the card title and make up the bulk of the card's content."
    >
      <Button href="#">Go somewhere</Button>
    </Card>
  )
}
