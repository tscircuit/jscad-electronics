import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "608 / both open": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing608" />
    </ComponentPreview>
  ),
  "625 ZZ / both shields": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing625zz" />
    </ComponentPreview>
  ),
  "625 2Z / both shields": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing6252z" />
    </ComponentPreview>
  ),
  "625 Z / bottom shield": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing625z" />
    </ComponentPreview>
  ),
  "625 RS / bottom seal": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing625rs" />
    </ComponentPreview>
  ),
  "625 2RS / both seals": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing6252rs" />
    </ComponentPreview>
  ),
  "625 ZZ / top open override": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing625zz_topsideopen" />
    </ComponentPreview>
  ),
  "Custom / top open, bottom open": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_bothsidesopen" />
    </ComponentPreview>
  ),
  "Custom / top open, bottom shielded": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id5mm_od16mm_w5mm_topsideopen_bottomsideshielded" />
    </ComponentPreview>
  ),
  "Custom / top open, bottom sealed": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_topsideopen_bottomsidesealed" />
    </ComponentPreview>
  ),
  "Custom / top shielded, bottom open": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_topsideshielded_bottomsideopen" />
    </ComponentPreview>
  ),
  "Custom / top shielded, bottom shielded": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_bothsidesshielded" />
    </ComponentPreview>
  ),
  "Custom / top shielded, bottom sealed": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_topsideshielded_bottomsidesealed" />
    </ComponentPreview>
  ),
  "Custom / top sealed, bottom open": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_topsidesealed_bottomsideopen" />
    </ComponentPreview>
  ),
  "Custom / top sealed, bottom shielded": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_topsidesealed_bottomsideshielded" />
    </ComponentPreview>
  ),
  "Custom / top sealed, bottom sealed": (
    <ComponentPreview>
      <Footprinter3d footprint="ballbearing_id8mm_od22mm_w7mm_bothsidessealed" />
    </ComponentPreview>
  ),
}
