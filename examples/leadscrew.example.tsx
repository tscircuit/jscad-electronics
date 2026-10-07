import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"
export default {
  "TR8x8(P2), four-start right hand": (
    <ComponentPreview>
      <Footprinter3d footprint="leadscrew_profile(iso2901)_tr8x8(p2)_l100mm" />
    </ComponentPreview>
  ),
  "TR8x2, single-start left hand": (
    <ComponentPreview>
      <Footprinter3d footprint="leadscrew_tr8x2_l100mm_hand(left)" />
    </ComponentPreview>
  ),
}
