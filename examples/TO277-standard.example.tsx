import { TO277 } from "../lib/TO277"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { to277StandardVariants } from "./fixtures/to277-standard-variants"
export default Object.fromEntries(
  Object.entries(to277StandardVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <TO277 {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
