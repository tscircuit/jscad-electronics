import { Rotate } from "jscad-fiber"
import { MSOP } from "../lib/MSOP"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { msopVariants } from "./fixtures/msop-variants"
export default Object.fromEntries(
  Object.entries(msopVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, variant.rotationZ]}>
          <MSOP {...variant.props} />
        </Rotate>
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
