import { useState } from 'react'
import { Card, CardBody, Button, Collapse } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        href="#"
        onClick={(event) => {
          event.preventDefault()
          setVisible(!visible)
        }}
      >
        Link
      </Button>
      <Button onClick={() => setVisible(!visible)}>Button</Button>
      <Collapse visible={visible}>
        <Card className="mt-3">
          <CardBody>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.
          </CardBody>
        </Card>
      </Collapse>
    </>
  )
}
