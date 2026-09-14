import { Tssop } from "../lib/Tssop"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { tssopVariants } from "./fixtures/tssop-variants"
export default Object.fromEntries(
  Object.entries(tssopVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Tssop {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
