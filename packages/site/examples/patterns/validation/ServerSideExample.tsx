import React from 'react'
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

export const Example = () => (
  <Grid component={Form} gap="md">
    <GridItem span={{ base: 'full', md: 4 }}>
      <TextInput label="First name" defaultValue="Mark" validFeedback="Looks good!" valid />
    </GridItem>
    <GridItem span={{ base: 'full', md: 4 }}>
      <TextInput label="Last name" defaultValue="Otto" validFeedback="Looks good!" valid />
    </GridItem>
    <GridItem span={{ base: 'full', md: 4 }}>
      <FormLabel htmlFor="validationServerUsername">Username</FormLabel>
      <InputGroup>
        <InputGroupAddon id="inputGroupPrepend03">@</InputGroupAddon>
        <TextInput
          id="validationServerUsername"
          aria-describedby="inputGroupPrepend03 validationServerUsernameFeedback"
          invalid
        />
      </InputGroup>
      <FormFeedback id="validationServerUsernameFeedback" invalid>
        Please choose a username.
      </FormFeedback>
    </GridItem>
    <GridItem span={{ base: 'full', md: 6 }}>
      <TextInput label="City" invalidFeedback="Please provide a valid city." invalid />
    </GridItem>
    <GridItem span={{ base: 'full', md: 3 }}>
      <Select label="State" invalidFeedback="Please select a valid state." invalid>
        <option disabled value="">
          Choose...
        </option>
        <option>California</option>
        <option>New York</option>
      </Select>
    </GridItem>
    <GridItem span={{ base: 'full', md: 3 }}>
      <TextInput label="Zip" invalidFeedback="Please provide a valid zip." invalid />
    </GridItem>
    <GridItem span="full">
      <Checkbox
        label="Agree to terms and conditions"
        aria-describedby="invalidCheckFeedback"
        invalid
        required
      />
      <FormFeedback id="invalidCheckFeedback" invalid>
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
