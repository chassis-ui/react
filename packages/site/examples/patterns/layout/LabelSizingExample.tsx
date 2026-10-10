import { FormLabel, Grid, GridItem, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Grid className="row-gap-zero mb-md">
        <FormLabel
          htmlFor="colFormLabelSm"
          id="colFormLabelSmLabel"
          className="col-span-full sm:col-span-2 col-form-label sm"
        >
          Email
        </FormLabel>
        <GridItem span={{ base: 'full', sm: 10 }}>
          <TextInput
            type="email"
            size="sm"
            id="colFormLabelSm"
            aria-labelledby="colFormLabelSmLabel"
            placeholder="col-form-label sm"
          />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero mb-md">
        <FormLabel
          htmlFor="colFormLabel"
          id="colFormLabelLabel"
          className="col-span-full sm:col-span-2 col-form-label"
        >
          Email
        </FormLabel>
        <GridItem span={{ base: 'full', sm: 10 }}>
          <TextInput
            type="email"
            id="colFormLabel"
            aria-labelledby="colFormLabelLabel"
            placeholder="col-form-label"
          />
        </GridItem>
      </Grid>
      <Grid className="row-gap-zero">
        <FormLabel
          htmlFor="colFormLabelLg"
          id="colFormLabelLgLabel"
          className="col-span-full sm:col-span-2 col-form-label lg"
        >
          Email
        </FormLabel>
        <GridItem span={{ base: 'full', sm: 10 }}>
          <TextInput
            type="email"
            size="lg"
            id="colFormLabelLg"
            aria-labelledby="colFormLabelLgLabel"
            placeholder="col-form-label lg"
          />
        </GridItem>
      </Grid>
    </>
  )
}
