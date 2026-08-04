import { Icon, CxInputAdorn, CxSelect } from '@chassis-ui/react'

export const Example = () => {
  const options = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' }
  ]
  return (
    <CxSelect
      aria-label="Language"
      placeholder="Choose a language"
      options={options}
      adornStart={
        <CxInputAdorn>
          <Icon name="search-outline" size={16} />
        </CxInputAdorn>
      }
      adornEnd={<CxInputAdorn>Required</CxInputAdorn>}
    />
  )
}
