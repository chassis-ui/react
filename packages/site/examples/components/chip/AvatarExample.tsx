import { Avatar, Chip, CloseButton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Chip color="default">
      <Avatar src="https://i.pravatar.cc/256" component="span" />
      Jane Doe
      <CloseButton label="Remove Jane Doe" />
    </Chip>
  )
}
