import { CxIcon, CxInputHelp, CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput
        aria-label="Search"
        placeholder="Search..."
        adornStart={
          <CxInputHelp>
            <CxIcon name="search-outline" size={16} />
          </CxInputHelp>
        }
      />
      <CxTextInput
        aria-label="Amount in dollars"
        placeholder="0.00"
        adornStart={<CxInputHelp>$</CxInputHelp>}
        adornEnd={<CxInputHelp>USD</CxInputHelp>}
      />
    </>
  )
}
