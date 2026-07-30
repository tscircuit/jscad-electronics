import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/ExtrudedPads"
import { Footprinter3d } from "lib/Footprinter3d"

const footprint =
  "rj45_ledpins_firstpinleft_p1.27mm_py2.54mm_shieldx7.914894mm_shieldy-3.770122mm_shieldid1.700022mm_holex5.715mm_holey-7.62mm_holed3.3000188mm_ledx3.869944mm_ledp2.54mm_ledy-11.729974mm_bodyy-5.865mm_h16.764mm_w16.256mm"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Footprinter3d footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
