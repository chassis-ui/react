import {
  Button,
  Checkbox,
  Form,
  FormLabel,
  Grid,
  GridItem,
  Radio,
  RadioGroup,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <Grid className="row-gap-zero mb-md">
        <FormLabel
          htmlFor="inputEmail3"
          id="inputEmail3Label"
          className="col-span-full sm:col-span-2 col-form-label"
        >
          Email
        </FormLabel>
        <GridItem span={{ base: 'full', sm: 10 }}>
          <TextInput type="email" id="inputEmail3" aria-labelledby="inputEmail3Label" />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <FormLabel
          htmlFor="inputPassword3"
          id="inputPassword3Label"
          className="col-span-full sm:col-span-2 col-form-label"
        >
          Password
        </FormLabel>
        <GridItem span={{ base: 'full', sm: 10 }}>
          <TextInput
            autoComplete="current-password"
            type="password"
            id="inputPassword3"
            aria-labelledby="inputPassword3Label"
          />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <GridItem span={{ base: 'full', sm: 10 }} start={{ sm: 3 }}>
          <RadioGroup label="Radios" defaultValue="option1">
            <Radio value="option1" label="First radio" />
            <Radio value="option2" label="Second radio" />
            <Radio value="option3" label="Third disabled radio" disabled />
          </RadioGroup>
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <GridItem span={{ base: 'full', sm: 10 }} start={{ sm: 3 }}>
          <Checkbox id="gridCheck1" label="Example checkbox" />
        </GridItem>
      </Grid>
      <Button type="submit">Sign in</Button>
    </Form>
  )
}
