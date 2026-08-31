import { Avatar, AvatarImage } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/256" alt="Profile picture" loading="lazy" />
      </Avatar>
    </>
  )
}
