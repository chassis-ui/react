import { useState } from 'react'
import { CxButton, CxCard, CxCardBody, CxCollapse } from '@chassis-ui/react'

export const HorizontalExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton
        className="mb-3"
        onClick={() => setVisible(!visible)}
        aria-expanded={visible}
        aria-controls="collapseWidthExample"
      >
        Button
      </CxButton>
      <div style={{ minHeight: '120px' }}>
        <CxCollapse id="collapseWidthExample" horizontal visible={visible}>
          <CxCard style={{ width: '300px' }}>
            <CxCardBody>
              This is some placeholder content for a horizontal collapse. It's hidden by default and
              shown when triggered.
            </CxCardBody>
          </CxCard>
        </CxCollapse>
      </div>
    </>
  )
}
