import { FormLabel, Grid, GridItem, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid className="row-gap-zero mb-md">
        <FormLabel
          htmlFor="colFormLabelSm"
          className="col-span-full sm:col-span-2 col-form-label sm"
        >
          Email
        </FormLabel>
        <GridItem span="full" responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" size="sm" id="colFormLabelSm" placeholder="col-form-label sm" />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <FormLabel htmlFor="colFormLabel" className="col-span-full sm:col-span-2 col-form-label">
          Email
        </FormLabel>
        <GridItem span="full" responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" id="colFormLabel" placeholder="col-form-label" />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero">
        <FormLabel
          htmlFor="colFormLabelLg"
          className="col-span-full sm:col-span-2 col-form-label lg"
        >
          Email
        </FormLabel>
        <GridItem span="full" responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" size="lg" id="colFormLabelLg" placeholder="col-form-label lg" />
        </GridItem>
      </Grid>
    </>
  )
}
