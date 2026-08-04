import { Icon, CxInputAdorn, CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput
        aria-label="Search"
        placeholder="Search..."
        adornStart={
          <CxInputAdorn>
            <Icon name="search-outline" size={16} />
          </CxInputAdorn>
        }
      />
      <CxTextInput
        aria-label="Amount in dollars"
        placeholder="0.00"
        adornStart={<CxInputAdorn>$</CxInputAdorn>}
        adornEnd={<CxInputAdorn>USD</CxInputAdorn>}
      />
    </>
  )
}
