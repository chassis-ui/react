import { useState } from 'react'
import { Card, CxButton, Collapse } from '@chassis-ui/react'

export const BasicExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton
        href="#"
        onClick={(event) => {
          event.preventDefault()
          setVisible(!visible)
        }}
      >
        Link
      </CxButton>
      <CxButton onClick={() => setVisible(!visible)}>Button</CxButton>
      <Collapse visible={visible}>
        <Card className="mt-3">
          <Card.Body>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.
          </Card.Body>
        </Card>
      </Collapse>
    </>
  )
}
