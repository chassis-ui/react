import { Icon, InputAdorn, Select } from '@chassis-ui/react'

export const Example = () => {
  const options = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' }
  ]
  return (
    <Select
      aria-label="Language"
      placeholder="Choose a language"
      options={options}
      adornStart={
        <InputAdorn>
          <Icon name="search-outline" size={16} />
        </InputAdorn>
      }
      adornEnd={<InputAdorn>Required</InputAdorn>}
    />
  )
}
