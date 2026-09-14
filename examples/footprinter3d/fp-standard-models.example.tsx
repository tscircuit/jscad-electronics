import { Footprinter3d } from "../../lib/Footprinter3d"
import { ComponentPreview } from "../utils/ComponentPreview"
import { footprinter3dModelVariants } from "../fixtures/footprinter3d-model-variants"
/** Model dimensions have their own typed prop. The footprint remains a legal
 * copper string; no model names or physical dimensions are appended as tokens. */
export default Object.fromEntries(
  Object.entries(footprinter3dModelVariants).map(([name, props]) => [
    name,
    <ComponentPreview>
      <Footprinter3d {...props} />
    </ComponentPreview>,
  ]),
)
