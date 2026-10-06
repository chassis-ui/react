import { useState } from 'react'
import { Button, Card, CardBody, Collapse, Grid } from '@chassis-ui/react'

export const Example = () => {
  const [visibleA, setVisibleA] = useState(false)
  const [visibleB, setVisibleB] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleA(!visibleA)}>Toggle first element</Button>
      <Button onClick={() => setVisibleB(!visibleB)}>Toggle second element</Button>
      <Button
        onClick={() => {
          setVisibleA(!visibleA)
          setVisibleB(!visibleB)
        }}
      >
        Toggle both elements
      </Button>
      <Grid columns={2} gap="md">
        <div>
          <Collapse visible={visibleA}>
            <Card className="mt-md">
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CardBody>
            </Card>
          </Collapse>
        </div>
        <div>
          <Collapse visible={visibleB}>
            <Card className="mt-md">
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CardBody>
            </Card>
          </Collapse>
        </div>
      </Grid>
    </>
  )
}
