import { Button, FormField, InputGroup, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField
      label="Coupon code"
      help="One code per order."
      ids={{ help: 'ffCouponHelp', input: 'ffCoupon', label: 'ffCouponLabel' }}
    >
      <InputGroup>
        <TextInput
          aria-describedby="ffCouponHelp"
          aria-labelledby="ffCouponLabel"
          id="ffCoupon"
          name="coupon"
        />
        <Button color="secondary" type="button" variant="outline">
          Apply
        </Button>
      </InputGroup>
    </FormField>
  )
}
