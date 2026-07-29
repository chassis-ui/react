import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

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

describe('CxCardGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxCardGroup className="bazinga">Test</CxCardGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('card-group', 'bazinga')
      expect(group.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot with nested cards', () => {
      const { container } = render(
        <CxCardGroup>
          <CxCard>
            <CxCardImage component="svg">Image</CxCardImage>
            <CxCardHeader>Header</CxCardHeader>
            <CxCardBody>
              <CxCardTitle>Title</CxCardTitle>
              <CxCardSubtitle>Subtitle</CxCardSubtitle>
              <CxCardText>Text</CxCardText>
              <CxCardLink href="/bazinga">Link</CxCardLink>
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
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCardGroup ref={ref}>Test</CxCardGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardGroup>Test</CxCardGroup>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
