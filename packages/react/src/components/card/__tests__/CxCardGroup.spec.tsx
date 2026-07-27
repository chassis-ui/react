import * as React from 'react'
import { render } from '@testing-library/react'

import {
  CxCard,
  CxCardBody,
  CxCardFooter,
  CxCardHeader,
  CxCardImage,
  CxCardLink,
  CxCardSubtitle,
  CxCardTitle,
  CxCardText,
  CxCardGroup
} from '../../../index'

test('loads and displays CxCardGroup component', async () => {
  const { container } = render(<CxCardGroup>Test</CxCardGroup>)
  expect(container).toMatchSnapshot()
})

test('CxCardGroup customize', async () => {
  const { container } = render(<CxCardGroup className="bazinga">Test</CxCardGroup>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-group')
})

test('CxCardGroup full example', async () => {
  const { container } = render(
    <CxCardGroup className="bazinga">
      <CxCard>
        <CxCardImage component="svg">Image</CxCardImage>
        <CxCardHeader>Header</CxCardHeader>
        <CxCardBody>
          <CxCardTitle>Title</CxCardTitle>
          <CxCardSubtitle>Subtitle</CxCardSubtitle>
          <CxCardText>Text</CxCardText>
          <CxCardLink>Link</CxCardLink>
        </CxCardBody>
        <CxCardFooter>Footer</CxCardFooter>
      </CxCard>
      <CxCard>
        <CxCardBody>
          <CxCardTitle>Card Title</CxCardTitle>
        </CxCardBody>
      </CxCard>
    </CxCardGroup>
  )
  expect(container).toMatchSnapshot()
})
