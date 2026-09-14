import { MSOP } from "../lib/MSOP"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { msopVariants } from "./fixtures/msop-variants"
export default Object.fromEntries(
  Object.entries(msopVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <MSOP {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
