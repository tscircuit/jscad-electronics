import { SSOP } from "../lib/SSOP"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { ssopStandardVariants } from "./fixtures/ssop-standard-variants"
export default Object.fromEntries(
  Object.entries(ssopStandardVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <SSOP {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
