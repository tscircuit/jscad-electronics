import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/ExtrudedPads"
import { Footprinter3d } from "lib/Footprinter3d"

const footprint = "lga16_grid5x3_p0.5mm_w3.6mm_h3.6mm_pw0.28mm_pl0.8mm"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Footprinter3d footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
