import { SOT89 } from "../lib/SOT89"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { sot89StandardVariants } from "./fixtures/sot89-standard-variants"
export default Object.fromEntries(
  Object.entries(sot89StandardVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <SOT89 {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
