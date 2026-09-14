import { LGA } from "../lib/LGA"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { lgaStandardVariants } from "./fixtures/lga-standard-variants"
export default Object.fromEntries(
  Object.entries(lgaStandardVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <LGA {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
