import { useState } from 'react'
import { CxButton, CxCard, CxCardBody, CxCol, CxCollapse, CxRow } from '@chassis-ui/react'

export const MultipleTargetsExample = () => {
  const [visibleA, setVisibleA] = useState(false)
  const [visibleB, setVisibleB] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisibleA(!visibleA)}>Toggle first element</CxButton>
      <CxButton onClick={() => setVisibleB(!visibleB)}>Toggle second element</CxButton>
      <CxButton
        onClick={() => {
          setVisibleA(!visibleA)
          setVisibleB(!visibleB)
        }}
      >
        Toggle both elements
      </CxButton>
      <CxRow>
        <CxCol xs={6}>
          <CxCollapse visible={visibleA}>
            <CxCard className="mt-3">
              <CxCardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CxCardBody>
            </CxCard>
          </CxCollapse>
        </CxCol>
        <CxCol xs={6}>
          <CxCollapse visible={visibleB}>
            <CxCard className="mt-3">
              <CxCardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CxCardBody>
            </CxCard>
          </CxCollapse>
        </CxCol>
      </CxRow>
    </>
  )
}
