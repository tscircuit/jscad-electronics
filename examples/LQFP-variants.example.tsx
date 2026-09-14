import { LQFP } from "../lib/lqfp"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { lqfpPhysicalVariants } from "./fixtures/lqfp-physical-variants"
export default Object.fromEntries(
  Object.entries(lqfpPhysicalVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <LQFP {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
