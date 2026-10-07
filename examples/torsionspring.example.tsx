import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"
export default {
  Right: (
    <ComponentPreview>
      <Footprinter3d footprint="torsionspring_od8mm_wire0.8mm_turns3.25_pitch1mm_start10mm_end14mm_right" />
    </ComponentPreview>
  ),
  Left: (
    <ComponentPreview>
      <Footprinter3d footprint="torsionspring_od8mm_wire0.8mm_turns3.25_pitch1mm_start10mm_end14mm_left" />
    </ComponentPreview>
  ),
}
