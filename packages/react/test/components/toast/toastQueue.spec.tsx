import { addToast, closeToast, toastQueue } from '../../../src/components/toast/toastQueue'

describe('toastQueue', () => {
  test('addToast queues content and closeToast removes it immediately', () => {
    const key = addToast('Saved!')
    expect(toastQueue.visibleToasts.some((toast) => toast.key === key)).toBe(true)

    closeToast(key)
    expect(toastQueue.visibleToasts.some((toast) => toast.key === key)).toBe(false)
  })

  test('addToast merges the optional options onto the queued content', () => {
    const key = addToast('Saved!', { color: 'success', autohide: false })
    const queued = toastQueue.visibleToasts.find((toast) => toast.key === key)
    expect(queued?.content).toMatchObject({
      children: 'Saved!',
      color: 'success',
      autohide: false
    })
    closeToast(key)
  })
})
