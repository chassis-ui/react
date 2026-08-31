import { Badge, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Button color="primary" className="position-relative">
        Profile
        <Badge color="danger" position="top-start" circle>
          99+ <span className="visually-hidden">unread messages</span>
        </Badge>
      </Button>
      <Button color="primary" className="position-relative ms-xsmall">
        Profile
        <Badge color="danger" position="top-end" circle>
          99+ <span className="visually-hidden">unread messages</span>
        </Badge>
      </Button>
      <br />
      <Button color="primary" className="position-relative">
        Profile
        <Badge color="danger" position="bottom-start" circle>
          99+ <span className="visually-hidden">unread messages</span>
        </Badge>
      </Button>
      <Button color="primary" className="position-relative ms-xsmall">
        Profile
        <Badge color="danger" position="bottom-end" circle>
          99+ <span className="visually-hidden">unread messages</span>
        </Badge>
      </Button>
    </>
  )
}
