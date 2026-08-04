import { useState } from 'react'
import { Card, Button, Collapse } from '@chassis-ui/react'

export const HorizontalExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        className="mb-3"
        onClick={() => setVisible(!visible)}
        aria-expanded={visible}
        aria-controls="collapseWidthExample"
      >
        Button
      </Button>
      <div style={{ minHeight: '120px' }}>
        <Collapse id="collapseWidthExample" horizontal visible={visible}>
          <Card style={{ width: '300px' }}>
            <Card.Body>
              This is some placeholder content for a horizontal collapse. It's hidden by default and
              shown when triggered.
            </Card.Body>
          </Card>
        </Collapse>
      </div>
    </>
  )
}
