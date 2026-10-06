import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Form,
  FormFeedback,
  FormLabel,
  Grid,
  GridItem,
  InputGroup,
  InputGroupAddon,
  Select,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  return (
    <Grid component={Form} gap="md" noValidate validated={validated} onSubmit={handleSubmit}>
      <GridItem span="full" responsive={{ md: { span: 4 } }}>
        <TextInput label="First name" defaultValue="Mark" validFeedback="Looks good!" required />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 4 } }}>
        <TextInput label="Last name" defaultValue="Otto" validFeedback="Looks good!" required />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 4 } }}>
        <FormLabel htmlFor="validationCustomUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroupAddon id="inputGroupPrepend">@</InputGroupAddon>
          <TextInput
            id="validationCustomUsername"
            aria-describedby="inputGroupPrepend usernameFeedback"
            required
          />
        </InputGroup>
        <FormFeedback id="usernameFeedback" invalid>
          Please choose a username.
        </FormFeedback>
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        <TextInput label="City" invalidFeedback="Please provide a valid city." required />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 3 } }}>
        <Select label="State" invalidFeedback="Please select a valid state." required>
          <option disabled value="">
            Choose...
          </option>
          <option>California</option>
          <option>New York</option>
        </Select>
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 3 } }}>
        <TextInput label="Zip" invalidFeedback="Please provide a valid zip." required />
      </GridItem>
      <GridItem span="full">
        <Checkbox label="Agree to terms and conditions" aria-describedby="agreeFeedback" required />
        <FormFeedback id="agreeFeedback" invalid>
          You must agree before submitting.
        </FormFeedback>
      </GridItem>
      <GridItem span="full">
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </GridItem>
    </Grid>
  )
}
