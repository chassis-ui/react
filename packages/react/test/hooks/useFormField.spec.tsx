import { renderHook } from '@testing-library/react'

import { useFormField } from '../../src/hooks/useFormField'

describe('useFormField', () => {
  describe('id generation', () => {
    test('generates inputId, labelId, helpId and feedbackId from a shared base id when id is unset', () => {
      const { result } = renderHook(() => useFormField({}))
      const { feedbackId, helpId, inputId, labelId } = result.current
      expect(labelId).toBe(`${inputId}-label`)
      expect(helpId).toBe(`${inputId}-help`)
      expect(feedbackId).toBe(`${inputId}-feedback`)
    })

    test('uses a caller-supplied id as inputId instead of the generated one', () => {
      const { result } = renderHook(() => useFormField({ id: 'custom-id' }))
      expect(result.current.inputId).toBe('custom-id')
    })
  })

  describe('describedBy', () => {
    test('is undefined when nothing describes the field', () => {
      const { result } = renderHook(() => useFormField({}))
      expect(result.current.describedBy).toBeUndefined()
    })

    test('includes helpId only when help is set', () => {
      const { result } = renderHook(() => useFormField({ help: 'Some help' }))
      expect(result.current.describedBy).toBe(result.current.helpId)
    })

    test('includes feedbackId only when invalid and invalidFeedback are both set', () => {
      const { result: withoutInvalid } = renderHook(() =>
        useFormField({ invalidFeedback: 'Required' })
      )
      expect(withoutInvalid.current.describedBy).toBeUndefined()

      const { result: withInvalid } = renderHook(() =>
        useFormField({ invalid: true, invalidFeedback: 'Required' })
      )
      expect(withInvalid.current.describedBy).toBe(withInvalid.current.feedbackId)
    })

    test('includes feedbackId only when valid and validFeedback are both set', () => {
      const { result } = renderHook(() =>
        useFormField({ valid: true, validFeedback: 'Looks good' })
      )
      expect(result.current.describedBy).toBe(result.current.feedbackId)
    })

    test('merges helpId, feedbackId and a caller-supplied ariaDescribedBy together', () => {
      const { result } = renderHook(() =>
        useFormField({
          help: 'Some help',
          invalid: true,
          invalidFeedback: 'Required',
          ariaDescribedBy: 'external-id'
        })
      )
      expect(result.current.describedBy).toBe(
        `${result.current.helpId} ${result.current.feedbackId} external-id`
      )
    })
  })

  describe('labelledBy', () => {
    test('is undefined when neither label nor ariaLabelledBy is set', () => {
      const { result } = renderHook(() => useFormField({}))
      expect(result.current.labelledBy).toBeUndefined()
    })

    test('includes labelId only when label is set', () => {
      const { result } = renderHook(() => useFormField({ label: 'Name' }))
      expect(result.current.labelledBy).toBe(result.current.labelId)
    })

    test('merges labelId and a caller-supplied ariaLabelledBy together', () => {
      const { result } = renderHook(() =>
        useFormField({ label: 'Name', ariaLabelledBy: 'external-label-id' })
      )
      expect(result.current.labelledBy).toBe(`${result.current.labelId} external-label-id`)
    })

    test('uses only ariaLabelledBy when label is unset', () => {
      const { result } = renderHook(() => useFormField({ ariaLabelledBy: 'external-label-id' }))
      expect(result.current.labelledBy).toBe('external-label-id')
    })
  })
})
