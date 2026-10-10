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
      <GridItem span={{ base: 'full', md: 6 }}>
        <FormLabel htmlFor="inputEmail4" id="inputEmail4Label">
          Email
        </FormLabel>
        <TextInput type="email" id="inputEmail4" aria-labelledby="inputEmail4Label" />
      </GridItem>
      <GridItem span={{ base: 'full', md: 6 }}>
        <FormLabel htmlFor="inputPassword4" id="inputPassword4Label">
          Password
        </FormLabel>
        <TextInput
          autoComplete="current-password"
          type="password"
          id="inputPassword4"
          aria-labelledby="inputPassword4Label"
        />
      </GridItem>
      <GridItem span="full">
        <FormLabel htmlFor="inputAddress" id="inputAddressLabel">
          Address
        </FormLabel>
        <TextInput
          id="inputAddress"
          aria-labelledby="inputAddressLabel"
          placeholder="1234 Main St"
        />
      </GridItem>
      <GridItem span="full">
        <FormLabel htmlFor="inputAddress2" id="inputAddress2Label">
          Address 2
        </FormLabel>
        <TextInput
          id="inputAddress2"
          aria-labelledby="inputAddress2Label"
          placeholder="Apartment, studio, or floor"
        />
      </GridItem>
      <GridItem span={{ base: 'full', md: 6 }}>
        <FormLabel htmlFor="inputCity" id="inputCityLabel">
          City
        </FormLabel>
        <TextInput id="inputCity" aria-labelledby="inputCityLabel" />
      </GridItem>
      <GridItem span={{ base: 'full', md: 4 }}>
        <FormLabel htmlFor="inputState">State</FormLabel>
        <Select id="inputState">
          <option>Choose...</option>
          <option>...</option>
        </Select>
      </GridItem>
      <GridItem span={{ base: 'full', md: 2 }}>
        <FormLabel htmlFor="inputZip" id="inputZipLabel">
          Zip
        </FormLabel>
        <TextInput id="inputZip" aria-labelledby="inputZipLabel" />
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
