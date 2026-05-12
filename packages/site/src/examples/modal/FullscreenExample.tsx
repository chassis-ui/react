import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxLink,
  CxModal,
  CxModalBody,
  CxModalFooter,
  CxModalHeader,
  CxModalTitle,
  CxPopover,
  CxTooltip,
} from '@chassis-ui/react'

export const FullscreenExample = () => {
  const [visible, setVisible] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  const [visibleMd, setVisibMdSm] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleXXL, setVisibleXXL] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(!visible)}>Full screen</CxButton>
      <CxButton onClick={() => setVisibleSm(!visibleSm)}>Full screen below sm</CxButton>
      <CxButton onClick={() => setVisibleMd(!visibleMd)}>Full screen below md</CxButton>
      <CxButton onClick={() => setVisibleLg(!visibleLg)}>Full screen below lg</CxButton>
      <CxButton onClick={() => setVisibleXL(!visibleXL)}>Full screen below xl</CxButton>
      <CxButton onClick={() => setVisibleXXL(!visibleXXL)}>Full screen below xxl</CxButton>
      <CxModal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="sm" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below sm</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="md" visible={visibleMd} onClose={() => setVisibleMd(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below md</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below lg</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below xl</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
      <CxModal fullscreen="xxl" visible={visibleXXL} onClose={() => setVisibleXXL(false)}>
        <CxModalHeader>
          <CxModalTitle>Full screen below xxl</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>...</CxModalBody>
      </CxModal>
    </>
  )
}
