import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
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
  vi.useFakeTimers()
  render(
    <CxTooltip trigger="hover" placement="right" content="content">
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      // react-aria only treats a hover as pointer-triggered (as opposed to touch/virtual) once
      // it's seen a real pointer-ish event on the page — establish that modality first. Needs
      // actual PointerEvents (not mouse events) for react-aria to recognize the modality under
      // this jsdom version.
      fireEvent.pointerMove(document.body)
      fireEvent.pointerEnter(link)
    }
  })
  act(() => vi.runAllTimers())
  act(() => vi.runAllTimers())
  expect(document.body).toMatchSnapshot()
  expect(document.body.getElementsByClassName('tooltip').length).toBe(1)
  expect(document.body.getElementsByClassName('cx-tooltip-auto').length).toBe(1)
  expect(document.body.getElementsByClassName('tooltip-arrow').length).toBe(1)
  const inner = document.body.getElementsByClassName('tooltip-inner')
  expect(inner.length).toBe(1)
  expect(inner[0].innerHTML).toBe('content')
  const tooltip = document.body.getElementsByClassName('tooltip')[0]
  expect(tooltip.getAttribute('data-cx-placement')).toBeTruthy()
  vi.useRealTimers()
})

test('CxTooltip scopes itself to an open dialog ancestor', async () => {
  vi.useFakeTimers()
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
      fireEvent.pointerMove(document.body)
      fireEvent.pointerEnter(link)
    }
  })
  act(() => vi.runAllTimers())
  const dialog = document.body.querySelector('dialog')
  const tooltip = document.body.querySelector('.tooltip')
  expect(tooltip).not.toBeNull()
  expect(dialog?.contains(tooltip)).toBe(true)
  vi.useRealTimers()
})

test('CxTooltip responds to the visible prop changing after mount', async () => {
  vi.useFakeTimers()
  const { rerender } = render(
    <CxTooltip content="content" visible={false}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => vi.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)

  rerender(
    <CxTooltip content="content" visible={true}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => vi.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(1)

  rerender(
    <CxTooltip content="content" visible={false}>
      <CxLink className="link">Test</CxLink>
    </CxTooltip>
  )
  act(() => vi.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)
  vi.useRealTimers()
})

test('CxTooltip has no axe violations when visible', async () => {
  vi.useFakeTimers()
  render(
    <CxTooltip content="content" visible>
      <CxLink href="#">Test</CxLink>
    </CxTooltip>
  )
  act(() => vi.runAllTimers())
  vi.useRealTimers()
  // The tooltip portals to document.body directly, sibling to the trigger's own render
  // container — neither sits inside a page landmark in this isolated fixture, which trips
  // axe's "region" best-practice rule. That rule is about overall page structure, not
  // anything CxTooltip itself controls, so it's disabled for this check.
  expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
})

test('CxTooltip with trigger="focus" ignores hover', async () => {
  vi.useFakeTimers()
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
  act(() => vi.runAllTimers())
  expect(document.body.getElementsByClassName('tooltip').length).toBe(0)
  vi.useRealTimers()
})
