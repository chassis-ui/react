import {
  addNotification,
  closeNotification,
  notificationQueue
} from '../../../src/components/notification/notificationQueue'

describe('notificationQueue', () => {
  test('addNotification queues content and closeNotification removes it immediately', () => {
    const key = addNotification('Saved!')
    expect(notificationQueue.visibleToasts.some((toast) => toast.key === key)).toBe(true)

    closeNotification(key)
    expect(notificationQueue.visibleToasts.some((toast) => toast.key === key)).toBe(false)
  })

  test('addNotification merges the optional shorthand options onto the queued content', () => {
    const key = addNotification('Saved!', { color: 'success', dismissible: true })
    const queued = notificationQueue.visibleToasts.find((toast) => toast.key === key)
    expect(queued?.content).toMatchObject({
      children: 'Saved!',
      color: 'success',
      dismissible: true
    })
    closeNotification(key)
  })
})
