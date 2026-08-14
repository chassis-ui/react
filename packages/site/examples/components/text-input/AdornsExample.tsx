import { Icon, InputAdorn, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput
        aria-label="Search"
        placeholder="Search..."
        adornStart={
          <InputAdorn>
            <Icon name="search-outline" size={16} />
          </InputAdorn>
        }
      />
      <TextInput
        aria-label="Amount in dollars"
        placeholder="0.00"
        adornStart={<InputAdorn>$</InputAdorn>}
        adornEnd={<InputAdorn>USD</InputAdorn>}
      />
    </>
  )
}
