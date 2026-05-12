import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxForm, CxFormLabel, CxFormInput, CxFormText, CxFormCheck, CxButton } from '../../../index'

test('loads and displays CxForm component', async () => {
  const { container } = render(<CxForm>Test</CxForm>)
  expect(container).toMatchSnapshot()
})

test('CxForm customize', async () => {
  const { container } = render(
    <CxForm className="bazinga" validated={true}>
      Test
    </CxForm>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('was-validated')
})

test('CxForm example', async () => {
  const { container } = render(
    <CxForm>
      <CxFormLabel>A</CxFormLabel>
      <CxFormInput type="email" aria-describedby="B" />
      <CxFormText>C</CxFormText>
      <CxFormCheck label="D" />
      <CxButton type="submit" context="primary">
        E
      </CxButton>
    </CxForm>,
  )
  expect(container).toMatchSnapshot()
})
