import {
  Button,
  Checkbox,
  Form,
  FormLabel,
  Grid,
  GridItem,
  Select,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid component={Form} gap="md">
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        <FormLabel htmlFor="inputEmail4">Email</FormLabel>
        <TextInput type="email" id="inputEmail4" />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        <FormLabel htmlFor="inputPassword4">Password</FormLabel>
        <TextInput autoComplete="current-password" type="password" id="inputPassword4" />
      </GridItem>
      <GridItem span="full">
        <FormLabel htmlFor="inputAddress">Address</FormLabel>
        <TextInput id="inputAddress" placeholder="1234 Main St" />
      </GridItem>
      <GridItem span="full">
        <FormLabel htmlFor="inputAddress2">Address 2</FormLabel>
        <TextInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }}>
        <FormLabel htmlFor="inputCity">City</FormLabel>
        <TextInput id="inputCity" />
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 4 } }}>
        <FormLabel htmlFor="inputState">State</FormLabel>
        <Select id="inputState">
          <option>Choose...</option>
          <option>...</option>
        </Select>
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 2 } }}>
        <FormLabel htmlFor="inputZip">Zip</FormLabel>
        <TextInput id="inputZip" />
      </GridItem>
      <GridItem span="full">
        <Checkbox id="gridCheck" label="Check me out" />
      </GridItem>
      <GridItem span="full">
        <Button type="submit">Sign in</Button>
      </GridItem>
    </Grid>
  )
}
