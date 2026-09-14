import { Rotate } from "jscad-fiber"
import { SOIC } from "../lib/SOIC"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { soicVariants } from "./fixtures/soic-variants"
export default Object.fromEntries(
  Object.entries(soicVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, variant.rotationZ]}>
          <SOIC {...variant.props} />
        </Rotate>
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
