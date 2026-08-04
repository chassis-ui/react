import { useState } from 'react'
import { Button, CxModal, CxModalBody, CxModalHeader, CxModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  const [visibleSmall, setVisibleSmall] = useState(false)
  const [visibleMedium, setVisibleMedium] = useState(false)
  const [visibleLarge, setVisibleLarge] = useState(false)
  const [visibleXlarge, setVisibleXlarge] = useState(false)
  const [visible2xlarge, setVisible2xlarge] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Full screen</Button>
      <Button onClick={() => setVisibleSmall(!visibleSmall)}>Full screen below small</Button>
      <Button onClick={() => setVisibleMedium(!visibleMedium)}>Full screen below medium</Button>
      <Button onClick={() => setVisibleLarge(!visibleLarge)}>Full screen below large</Button>
      <Button onClick={() => setVisibleXlarge(!visibleXlarge)}>Full screen below xlarge</Button>
      <Button onClick={() => setVisible2xlarge(!visible2xlarge)}>
        Full screen below 2xlarge
      </Button>
      <CxModal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="small" visible={visibleSmall} onClose={() => setVisibleSmall(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below small</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="medium" visible={visibleMedium} onClose={() => setVisibleMedium(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below medium</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="large" visible={visibleLarge} onClose={() => setVisibleLarge(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below large</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="xlarge" visible={visibleXlarge} onClose={() => setVisibleXlarge(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below xlarge</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal
        fullscreen="2xlarge"
        visible={visible2xlarge}
        onClose={() => setVisible2xlarge(false)}
      >
        <CxModalHeader>
          <CxModalTitle>Full screen below 2xlarge</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
    </>
  )
}
