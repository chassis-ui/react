import fs from 'fs'
import path from 'path'

import {
  BG_COLOR_CLASS_NAMES,
  FG_COLOR_CLASS_NAMES,
  ICON_COLOR_CLASS_NAMES,
  LINK_COLOR_CLASS_NAMES
} from '../../src/utils/colorClassNames'

// The tables hold whole class names so that Tailwind's scanner can read them, which leaves a
// name free to be misspelled: the type checks the keys of a table, not what each one maps to.
const TABLES = {
  bg: BG_COLOR_CLASS_NAMES,
  fg: FG_COLOR_CLASS_NAMES,
  icon: ICON_COLOR_CLASS_NAMES,
  link: LINK_COLOR_CLASS_NAMES
}

const utilities = fs.readFileSync(
  path.resolve(__dirname, '../../node_modules/@chassis-ui/css/dist/tailwind/utilities.css'),
  'utf8'
)

describe.each(Object.entries(TABLES))('the %s class of a context color', (family, table) => {
  test('is the family and the color', () => {
    for (const [color, className] of Object.entries(table)) {
      expect(className).toBe(`${family}-${color}`)
    }
  })

  test('is a utility of chassis-css', () => {
    for (const className of Object.values(table)) {
      expect(utilities).toContain(`@utility ${className} {`)
    }
  })
})
