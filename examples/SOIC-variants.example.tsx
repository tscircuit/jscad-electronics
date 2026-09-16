import { SOIC } from "../lib/SOIC"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { soicVariants } from "./fixtures/soic-variants"
export default Object.fromEntries(
  Object.entries(soicVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <SOIC {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
