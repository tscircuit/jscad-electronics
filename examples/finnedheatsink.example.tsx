import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"
export default {
  Standard: (
    <ComponentPreview>
      <Footprinter3d footprint="finnedheatsink_w20mm_l25mm_h12mm_base2mm_fin1mm_fins6" />
    </ComponentPreview>
  ),
  Compact: (
    <ComponentPreview>
      <Footprinter3d footprint="finnedheatsink_w7mm_l6mm_h7mm_base1mm_fin0.7mm_fins4" />
    </ComponentPreview>
  ),
}
