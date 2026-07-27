import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CxTooltip, CxLink } from '../../../index'

test('loads and displays CxTooltip component', async () => {
  const { container } = render(
    <CxTooltip content="content">
      <CxLink>Test</CxLink>
    </CxTooltip>
  )
  expect(container).toMatchSnapshot()
})

test('CxTooltip customize', async () => {
  jest.useFakeTimers()
  render(
    <CxTooltip trigger="hover" placement="right" content="content">
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      // react-aria only treats a hover as pointer-triggered (as opposed to touch/virtual) once
      // it's seen a real pointer-ish event on the page — establish that modality first.
      fireEvent.mouseMove(document.body)
      fireEvent.mouseEnter(link)
    }
  })
  act(() => jest.runAllTimers())
  act(() => jest.runAllTimers())
  expect(document.body).toMatchSnapshot()
  expect(document.body.getElementsByClassName('tooltip').length).toBe(1)
  expect(document.body.getElementsByClassName('cx-tooltip-auto').length).toBe(1)
  expect(document.body.getElementsByClassName('tooltip-arrow').length).toBe(1)
  const inner = document.body.getElementsByClassName('tooltip-inner')
  expect(inner.length).toBe(1)
  expect(inner[0].innerHTML).toBe('content')
  const tooltip = document.body.getElementsByClassName('tooltip')[0]
  expect(tooltip.getAttribute('data-cx-placement')).toBeTruthy()
  jest.useRealTimers()
})

test('CxTooltip scopes itself to an open dialog ancestor', async () => {
  jest.useFakeTimers()
  render(
    <dialog open>
      <CxTooltip trigger="hover" content="content">
        <CxLink className="link">Test</CxLink>
      </CxTooltip>
    </dialog>
  )
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      fireEvent.mouseMove(document.body)
      fireEvent.mouseEnter(link)
    }
  })
  act(() => jest.runAllTimers())
  const dialog = document.body.querySelector('dialog')
  const tooltip = document.body.querySelector('.tooltip')
  expect(tooltip).not.toBeNull()
  expect(dialog?.contains(tooltip)).toBe(true)
  jest.useRealTimers()
})

test('CxTooltip responds to the visible prop changing after mount', async () => {
  jest.useFakeTimers()
  const { rerender } = render(
    <CxTooltip content="content" visible={false}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)

  rerender(
    <CxTooltip content="content" visible={true}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(1)

  rerender(
    <CxTooltip content="content" visible={false}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)
  jest.useRealTimers()
})

test('CxTooltip with trigger="focus" ignores hover', async () => {
  jest.useFakeTimers()
  render(
    <CxTooltip trigger="focus" content="content">
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  const link = document.querySelector('.link') as HTMLElement
  act(() => {
    fireEvent.mouseMove(document.body)
    fireEvent.mouseEnter(link)
  })
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)
  jest.useRealTimers()
})
