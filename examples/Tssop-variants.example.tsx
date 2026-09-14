import { Rotate } from "jscad-fiber"
import { Tssop } from "../lib/Tssop"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { tssopVariants } from "./fixtures/tssop-variants"
export default Object.fromEntries(
  Object.entries(tssopVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, variant.rotationZ]}>
          <Tssop {...variant.props} />
        </Rotate>
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
