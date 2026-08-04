import { useState } from 'react'
import { Button, CxModal, CxModalBody, CxModalHeader, CxModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleXL(!visibleXL)}>Extra large modal</Button>
      <Button onClick={() => setVisibleLg(!visibleLg)}>Large modal</Button>
      <Button onClick={() => setVisibleSm(!visibleSm)}>Small modal</Button>
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
