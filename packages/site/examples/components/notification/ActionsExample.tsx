import { Notification, NotificationIcon, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="danger" role="alert" dismissible>
      <NotificationIcon
        name="exclamation-triangle-solid"
        className="align-self-start xlarge:align-self-center"
      />
      <div className="d-flex flex-column xlarge:flex-row gap-medium">
        <p className="m-0">
          A notification with inline actions — stacked on narrow viewports, side-by-side from xlarge
          up.
        </p>
        <div className="hstack gap-small align-items-center justify-content-end">
          <Button color="danger" size="small">
            Take Action
          </Button>
        </div>
      </div>
    </Notification>
  )
}
