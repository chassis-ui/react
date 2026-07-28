import React from 'react'
import {
  CxButton,
  CxForm,
  CxCheckbox,
  CxFormFeedback,
  CxTextInput,
  CxFormLabel,
  CxRadio,
  CxRadioGroup,
  CxSelect
} from '@chassis-ui/react'

export const SupportedElementsExample = () => {
  return (
    <CxForm validated={true}>
      <div className="mb-medium">
        <CxFormLabel htmlFor="validationTextarea" className="form-label">
          Textarea
        </CxFormLabel>
        <CxTextInput
          component="textarea"
          id="validationTextarea"
          placeholder="Required example textarea"
          invalid
          required
        ></CxTextInput>
        <CxFormFeedback invalid>Please enter a message in the textarea.</CxFormFeedback>
      </div>
      <CxCheckbox
        className="mb-medium"
        id="validationFormCheck1"
        label="Check this checkbox"
        required
      />
      <CxFormFeedback invalid>Example invalid feedback text</CxFormFeedback>
      <CxRadioGroup className="mb-medium" name="radio-stacked" required>
        <CxRadio value="radio1" label="Check this checkbox" />
        <CxRadio value="radio2" label="Or toggle this other radio" />
      </CxRadioGroup>
      <CxFormFeedback invalid>More example invalid feedback text</CxFormFeedback>
      <div className="mb-medium">
        <CxSelect required aria-label="select example">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </CxSelect>
        <CxFormFeedback invalid>Example invalid select feedback</CxFormFeedback>
      </div>
      <div className="mb-medium">
        <CxTextInput type="file" id="validationTextarea" aria-label="file example" required />
        <CxFormFeedback invalid>Example invalid form file feedback</CxFormFeedback>
      </div>
      <div className="mb-medium">
        <CxButton type="submit" context="primary" disabled>
          Submit form
        </CxButton>
      </div>
    </CxForm>
  )
}
