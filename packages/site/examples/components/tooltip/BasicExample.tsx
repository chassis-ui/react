import { Tooltip, Link } from '@chassis-ui/react'

export const Example = () => {
  return (
    <p className="medium:text-emphasis">
      Tight pants next level keffiyeh
      <Tooltip content="Tooltip text">
        <Link> you probably </Link>
      </Tooltip>
      haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown.
      Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel
      <Tooltip content="Tooltip text">
        <Link> have a </Link>
      </Tooltip>
      terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu
      biodiesel williamsburg marfa, four loko mcsweeney''s cleanse vegan chambray. A really ironic
      artisan
      <Tooltip content="Tooltip text">
        <Link> whatever keytar </Link>
      </Tooltip>
      scenester farm-to-table banksy Austin
      <Tooltip content="Tooltip text">
        <Link> twitter handle </Link>
      </Tooltip>
      freegan cred raw denim single-origin coffee viral.
    </p>
  )
}
