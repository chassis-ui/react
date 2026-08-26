import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  CardTitle
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card className="text-center">
      <CardHeader>Header</CardHeader>
      <CardBody>
        <CardTitle>Special title treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button href="#">Go somewhere</Button>
      </CardBody>
      <CardFooter className="medium:text-emphasis">2 days ago</CardFooter>
    </Card>
  )
}
