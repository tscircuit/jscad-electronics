import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "Set-screw shaft collar": (
    <ComponentPreview>
      <Footprinter3d footprint="shaftcollar_bore8mm_od16mm_w8mm_m4_setscrew" />
    </ComponentPreview>
  ),
  "Left-handed compression spring": (
    <ComponentPreview>
      <Footprinter3d footprint="compressionspring_od8mm_wire1mm_l20mm_turns8_closedground_lefthanded" />
    </ComponentPreview>
  ),
  "Plain bushing": (
    <ComponentPreview>
      <Footprinter3d footprint="plainbushing_id8mm_od12mm_l20mm" />
    </ComponentPreview>
  ),
}
