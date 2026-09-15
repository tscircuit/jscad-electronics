import { Footprinter3d } from "../../lib/Footprinter3d"
import { ComponentPreview } from "../utils/ComponentPreview"
import { bodyDimensionFootprints } from "../fixtures/footprinter-body-dimensions"
export default Object.fromEntries(
  Object.entries(bodyDimensionFootprints).map(([name, footprint]) => [
    name,
    <ComponentPreview>
      <Footprinter3d footprint={footprint} />
    </ComponentPreview>,
  ]),
)
