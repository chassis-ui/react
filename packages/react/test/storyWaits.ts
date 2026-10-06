import { configure } from 'storybook/test'

// A story's `waitFor` and `findBy*` wait for what the browser shows after its next frame: an open
// dialog, the mark of a scrollspy. On a CI runner a browser has taken 1.5s to render that frame
// with the page otherwise idle (measured in WebKit on the Scrollspy stories, chassis-ui/react#49),
// which is past testing-library's default of one second. A passing wait still returns at once.
configure({ asyncUtilTimeout: 5000 })
