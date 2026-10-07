import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  NEMA17: (
    <ComponentPreview>
      <Footprinter3d footprint="nemamotormount_nema17_w50mm_h60mm_depth40mm_t3mm_axisheight30mm_shaft23mm_motorhole3.5mm_basehole5.5mm_basexspan30mm_baseoffset20mm" />
    </ComponentPreview>
  ),
  NEMA23: (
    <ComponentPreview>
      <Footprinter3d footprint="nemamotormount_nema23_w70mm_h80mm_depth50mm_t4mm_axisheight40mm_shaft39.1mm_motorhole5.5mm_basehole5.5mm_basexspan45mm_baseoffset25mm" />
    </ComponentPreview>
  ),
}
