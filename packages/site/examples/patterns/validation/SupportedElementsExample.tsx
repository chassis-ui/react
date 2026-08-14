import React from 'react'
import {
  Button,
  FileInput,
  Form,
  Checkbox,
  FormFeedback,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Textarea
} from '@chassis-ui/react'

export const SupportedElementsExample = () => {
  return (
    <Form validated={true}>
      <div className="mb-medium">
        <FormLabel htmlFor="validationTextarea" className="form-label">
          Textarea
        </FormLabel>
        <Textarea
          id="validationTextarea"
          placeholder="Required example textarea"
          invalid
          required
        />
        <FormFeedback invalid>Please enter a message in the textarea.</FormFeedback>
      </div>
      <Checkbox
        className="mb-medium"
        id="validationFormCheck1"
        label="Check this checkbox"
        required
      />
      <FormFeedback invalid>Example invalid feedback text</FormFeedback>
      <RadioGroup className="mb-medium" name="radio-stacked" required>
        <Radio value="radio1" label="Check this checkbox" />
        <Radio value="radio2" label="Or toggle this other radio" />
      </RadioGroup>
      <FormFeedback invalid>More example invalid feedback text</FormFeedback>
      <div className="mb-medium">
        <Select required aria-label="select example">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
        <FormFeedback invalid>Example invalid select feedback</FormFeedback>
      </div>
      <div className="mb-medium">
        <FileInput id="validationFile" aria-label="file example" required />
        <FormFeedback invalid>Example invalid form file feedback</FormFeedback>
      </div>
      <div className="mb-medium">
        <Button type="submit" color="primary" disabled>
          Submit form
        </Button>
      </div>
    </Form>
  )
}
