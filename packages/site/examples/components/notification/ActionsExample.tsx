import { Notification, NotificationIcon, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="danger" role="alert" dismissible>
      <NotificationIcon
        name="exclamation-triangle-solid"
        className="align-self-start xl:align-self-center"
      />
      <div className="d-flex flex-column xl:flex-row gap-md">
        <p className="m-0">
          A notification with inline actions — stacked on narrow viewports, side-by-side from xl up.
        </p>
        <div className="hstack gap-sm align-items-center justify-content-end">
          <Button color="danger" size="sm">
            Take Action
          </Button>
        </div>
      </div>
    </Notification>
  )
}
