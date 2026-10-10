import { Flex, FormHelp, FormLabel, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex wrap="wrap" gap="md" align="center">
      <div>
        <FormLabel htmlFor="inputPassword6" id="inputPassword6Label" className="col-form-label">
          Password
        </FormLabel>
      </div>
      <div>
        <TextInput
          autoComplete="new-password"
          type="password"
          id="inputPassword6"
          aria-describedby="passwordHelpInline"
          aria-labelledby="inputPassword6Label"
        />
      </div>
      <div>
        <FormHelp component="span" id="passwordHelpInline">
          Must be 8-20 characters long.
        </FormHelp>
      </div>
    </Flex>
  )
}
