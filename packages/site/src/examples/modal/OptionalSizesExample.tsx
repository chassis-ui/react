import { useState } from 'react'
import { CxButton, CxModal, CxModalBody, CxModalHeader, CxModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisibleXL(!visibleXL)}>Extra large modal</CxButton>
      <CxButton onClick={() => setVisibleLg(!visibleLg)}>Large modal</CxButton>
      <CxButton onClick={() => setVisibleSm(!visibleSm)}>Small modal</CxButton>
      <CxModal size="xlarge" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <CxModalHeader>
          <CxModalTitle>Extra large modal</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal size="large" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <CxModalHeader>
          <CxModalTitle>Large modal</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal size="small" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <CxModalHeader>
          <CxModalTitle>Small modal</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
    </>
  )
}
