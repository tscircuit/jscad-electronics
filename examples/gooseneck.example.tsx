import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "Reading lamp / 90 degree bend": (
    <ComponentPreview>
      <Footprinter3d footprint="gooseneck_od6mm_id4mm_start38mm_end112mm_radius60mm_angle90_pitch2.25mm_depth0.25mm" />
    </ComponentPreview>
  ),
  "Straight ribbed arm": (
    <ComponentPreview>
      <Footprinter3d footprint="gooseneck_od6mm_id4mm_start150mm_end0mm_radius60mm_angle0_pitch2.25mm_depth0.25mm" />
    </ComponentPreview>
  ),
  "Smooth U bend": (
    <ComponentPreview>
      <Footprinter3d footprint="gooseneck_od8mm_id5mm_start20mm_end20mm_radius30mm_angle180_pitch3mm_depth0mm" />
    </ComponentPreview>
  ),
}
