import React from 'react'
import {
  Button,
  Checkbox,
  Form,
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
    <GridItem span="full" responsive={{ md: { span: 4 } }}>
      <TextInput label="First name" defaultValue="Mark" required />
    </GridItem>
    <GridItem span="full" responsive={{ md: { span: 4 } }}>
      <TextInput label="Last name" defaultValue="Otto" required />
    </GridItem>
    <GridItem span="full" responsive={{ md: { span: 4 } }}>
      <FormLabel htmlFor="validationDefaultUsername">Username</FormLabel>
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput id="validationDefaultUsername" required />
      </InputGroup>
    </GridItem>
    <GridItem span="full" responsive={{ md: { span: 6 } }}>
      <TextInput label="City" required />
    </GridItem>
    <GridItem span="full" responsive={{ md: { span: 3 } }}>
      <Select label="State" required>
        <option disabled value="">
          Choose...
        </option>
        <option>California</option>
        <option>New York</option>
      </Select>
    </GridItem>
    <GridItem span="full" responsive={{ md: { span: 3 } }}>
      <TextInput label="Zip" required />
    </GridItem>
    <GridItem span="full">
      <Checkbox label="Agree to terms and conditions" required />
    </GridItem>
    <GridItem span="full">
      <Button color="primary" type="submit">
        Submit form
      </Button>
    </GridItem>
  </Grid>
)
