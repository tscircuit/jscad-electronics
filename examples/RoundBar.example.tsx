import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"
export default {
  "Nominal roundbar": (
    <ComponentPreview>
      <Footprinter3d footprint="roundbar_diameter20mm_length100mm_chamfer1mm" />
    </ComponentPreview>
  ),
}
