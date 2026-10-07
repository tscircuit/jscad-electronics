import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"
export default {
  "TR8x8(P2), flanged": (
    <ComponentPreview>
      <Footprinter3d footprint="leadscrewnut_tr8x8(p2)_bodyod12mm_l15mm_flangeod22mm_flanget3mm_holes4_hole3.5mm_bcd16mm" />
    </ComponentPreview>
  ),
  "TR8x2, cylindrical": (
    <ComponentPreview>
      <Footprinter3d footprint="leadscrewnut_tr8x2_style(cylindrical)_bodyod12mm_l15mm" />
    </ComponentPreview>
  ),
}
