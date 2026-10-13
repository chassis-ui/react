import { beforeEach } from 'vitest'

// A story test file runs in an iframe of its own, and the browser's focus starts outside it. The
// first `focus()` of the file, from a click or from typing, then has to move focus into the frame
// as well. In Firefox 157 on Linux (Playwright 1.64) the frame takes focus a moment later and
// resets its active element to `<body>`: the first story of a file found nothing focused after a
// click, or typed into no field, in a different file on each run, in CI and in Playwright's image
// but not on macOS. Every story now starts with focus already in its frame.
beforeEach(async () => {
  if (document.hasFocus()) return
  window.focus()
  const deadline = performance.now() + 2000
  while (!document.hasFocus() && performance.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
})
