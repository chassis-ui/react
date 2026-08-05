import { Combobox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Language" placeholder="Choose a language…">
      <Combobox.Group label="Frontend">
        <Combobox.Item id="html">HTML</Combobox.Item>
        <Combobox.Item id="css">CSS</Combobox.Item>
        <Combobox.Item id="js">JavaScript</Combobox.Item>
      </Combobox.Group>
      <Combobox.Group label="Backend">
        <Combobox.Item id="python">Python</Combobox.Item>
        <Combobox.Item id="ruby">Ruby</Combobox.Item>
      </Combobox.Group>
      <Combobox.Item id="sql">SQL</Combobox.Item>
    </Combobox>
  )
}
