import { Rotate } from "jscad-fiber"
import { DO219AD } from "../lib/DO219AD"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { do219adVariants } from "./fixtures/do219ad-variants"
export default Object.fromEntries(
  Object.entries(do219adVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, Math.PI]}>
          <DO219AD {...variant.props} />
        </Rotate>
        {"footprint" in variant && (
          <ExtrudedPads footprint={variant.footprint} />
        )}
      </>
    </ComponentPreview>,
  ]),
)
