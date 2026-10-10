import React, { useState } from 'react'
import {
  Button,
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
      <GridItem span={{ base: 'full', md: 4 }} className="position-relative">
        <FormLabel htmlFor="validationTooltip01" id="validationTooltip01Label">
          First name
        </FormLabel>
        <TextInput
          id="validationTooltip01"
          aria-labelledby="validationTooltip01Label"
          defaultValue="Mark"
          required
        />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </GridItem>
      <GridItem span={{ base: 'full', md: 4 }} className="position-relative">
        <FormLabel htmlFor="validationTooltip02" id="validationTooltip02Label">
          Last name
        </FormLabel>
        <TextInput
          id="validationTooltip02"
          aria-labelledby="validationTooltip02Label"
          defaultValue="Otto"
          required
        />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </GridItem>
      <GridItem span={{ base: 'full', md: 4 }} className="position-relative">
        <FormLabel htmlFor="validationTooltipUsername" id="validationTooltipUsernameLabel">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon id="inputGroupPrependTooltip">@</InputGroupAddon>
          <TextInput
            id="validationTooltipUsername"
            aria-labelledby="validationTooltipUsernameLabel"
            aria-describedby="inputGroupPrependTooltip"
            required
          />
        </InputGroup>
        <FormFeedback tooltip invalid>
          Please choose a username.
        </FormFeedback>
      </GridItem>
      <GridItem span={{ base: 'full', md: 6 }} className="position-relative">
        <FormLabel htmlFor="validationTooltip03" id="validationTooltip03Label">
          City
        </FormLabel>
        <TextInput id="validationTooltip03" aria-labelledby="validationTooltip03Label" required />
        <FormFeedback tooltip invalid>
          Please provide a valid city.
        </FormFeedback>
      </GridItem>
      <GridItem span={{ base: 'full', md: 3 }} className="position-relative">
        <FormLabel htmlFor="validationTooltip04">State</FormLabel>
        <Select id="validationTooltip04" required>
          <option disabled value="">
            Choose...
          </option>
          <option>California</option>
          <option>New York</option>
        </Select>
        <FormFeedback tooltip invalid>
          Please select a valid state.
        </FormFeedback>
      </GridItem>
      <GridItem span={{ base: 'full', md: 3 }} className="position-relative">
        <FormLabel htmlFor="validationTooltip05" id="validationTooltip05Label">
          Zip
        </FormLabel>
        <TextInput id="validationTooltip05" aria-labelledby="validationTooltip05Label" required />
        <FormFeedback tooltip invalid>
          Please provide a valid zip.
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
