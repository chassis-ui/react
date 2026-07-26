import { CxTooltip, CxLink } from '@chassis-ui/react'

export const BasicExample = () => {
  return (
    <p className="medium:text-emphasis">
      Tight pants next level keffiyeh
      <CxTooltip content="Tooltip text">
        <CxLink> you probably </CxLink>
      </CxTooltip>
      haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown.
      Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel
      <CxTooltip content="Tooltip text">
        <CxLink> have a </CxLink>
      </CxTooltip>
      terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu
      biodiesel williamsburg marfa, four loko mcsweeney''s cleanse vegan chambray. A really ironic
      artisan
      <CxTooltip content="Tooltip text">
        <CxLink> whatever keytar </CxLink>
      </CxTooltip>
      scenester farm-to-table banksy Austin
      <CxTooltip content="Tooltip text">
        <CxLink> twitter handle </CxLink>
      </CxTooltip>
      freegan cred raw denim single-origin coffee viral.
    </p>
  )
}
