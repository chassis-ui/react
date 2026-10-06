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
        <FormLabel htmlFor="inputEmail3" className="col-span-full sm:col-span-2 col-form-label">
          Email
        </FormLabel>
        <GridItem span="full" responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" id="inputEmail3" />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <FormLabel htmlFor="inputPassword3" className="col-span-full sm:col-span-2 col-form-label">
          Password
        </FormLabel>
        <GridItem span="full" responsive={{ sm: { span: 10 } }}>
          <TextInput autoComplete="current-password" type="password" id="inputPassword3" />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <GridItem span="full" responsive={{ sm: { span: 10, start: 3 } }}>
          <RadioGroup label="Radios" defaultValue="option1">
            <Radio value="option1" label="First radio" />
            <Radio value="option2" label="Second radio" />
            <Radio value="option3" label="Third disabled radio" disabled />
          </RadioGroup>
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <GridItem span="full" responsive={{ sm: { span: 10, start: 3 } }}>
          <Checkbox id="gridCheck1" label="Example checkbox" />
        </GridItem>
      </Grid>
      <Button type="submit">Sign in</Button>
    </Form>
  )
}
